/*** Wunderground Z-Way HA module *******************************************

Version: 1.0.1
(c) Z-Wave.Me, 2014
-----------------------------------------------------------------------------
Author: Pieter E. Zanstra adaptation for Wunderground Weather Services API
Derived from OpenWeather module by Serguei Poltorak <ps@z-wave.me>
Description:
This module creates temperature widget

 ******************************************************************************/

// ----------------------------------------------------------------------------
// --- Class definition, inheritance and setup
// ----------------------------------------------------------------------------

function Wunderground(id, controller) {
	// Call superconstructor first (AutomationModule)
	Wunderground.super_.call(this, id, controller);
}

inherits(Wunderground, AutomationModule);

_module = Wunderground;

// ----------------------------------------------------------------------------
// --- Module instance initialized
// ----------------------------------------------------------------------------

Wunderground.prototype.init = function (config) {
	Wunderground.super_.prototype.init.call(this, config);

	var self = this;

	this.vDev = self.controller.devices.create({
			deviceId : "Wunderground_" + this.id,
			defaults : {
				deviceType : "sensorMultilevel",
				metrics : {
					probeTitle : 'Temperature'
				}
			},
			overlay : {
				metrics : {
					scaleTitle : '°C',
					title : this.config.city
				}
			},
			moduleId : this.id
		});

        this.vDev2 = self.controller.devices.create({
                        deviceId : "Wunderground_" + this.id + "-1",
                        defaults : {
                                deviceType : "text",
                                metrics : {
                                        probeTitle : 'Wind Direction'
                                }
                        },
                        overlay : {
                                metrics : {
                                        scaleTitle : '',
                                        title : this.config.city
                                }
                        },
                        moduleId : this.id
                });

	this.timer = setInterval(function () {
			self.fetchWeather(self);
		}, 900 * 1000);
	self.fetchWeather(self);
};

Wunderground.prototype.stop = function () {
	Wunderground.super_.prototype.stop.call(this);

	if (this.timer)
		clearInterval(this.timer);

	if (this.vDev) {
		this.controller.devices.remove(this.vDev.id);
		this.vDev = null;
	}


        if (this.vDev2) {
                this.controller.devices.remove(this.vDev2.id);
                this.vDev2 = null;
        }
};

// ----------------------------------------------------------------------------
// --- Module methods
// ----------------------------------------------------------------------------

Wunderground.prototype.fetchWeather = function (instance) {
	var self = instance,
	moduleName = "Wunderground",
	langFile = self.controller.loadModuleLang(moduleName);

	http.request({
		url : "http://api.wunderground.com/api/" + self.config.key + "/conditions/forecast/q/" + self.config.country + "/" + self.config.city + ".json",
		async : true,
		success : function (res) {
			try {
				var temp = res.data.current_observation.temp_c,
				windgust = parseInt(res.data.current_observation.wind_gust_kph),
				pressure = parseInt(res.data.current_observation.pressure_mb),
				wind_degrees = parseInt(res.data.current_observation.wind_degrees),
				observe_time = res.data.current_observation.local_time_rfc822,
				max_temp = parseInt(res.data.forecast.simpleforecast.forecastday[0].high.celsius),
				icon = res.data.current_observation.icon_url;

				if ((wind_degrees <= 11) || (wind_degrees >= 349)) {
					wind_dir = "N";
				} else if (wind_degrees <= 34) {
					wind_dir = "NNE";
				} else if (wind_degrees <= 56) {
					wind_dir = "NE";
				} else if (wind_degrees <= 79) {
					wind_dir = "ENE";
				} else if (wind_degrees <= 101) {
					wind_dir = "E";
				} else if (wind_degrees <= 124) {
					wind_dir = "ESE";
				} else if (wind_degrees <= 146) {
					wind_dir = "SE";
				} else if (wind_degrees <= 169) {
					wind_dir = "SSE";
				} else if (wind_degrees <= 191) {
					wind_dir = "S";
				} else if (wind_degrees <= 214) {
					wind_dir = "SSW";
				} else if (wind_degrees <= 236) {
					wind_dir = "SW";
				} else if (wind_degrees <= 259) {
					wind_dir = "WSW";
				} else if (wind_degrees <= 281) {
					wind_dir = "W";
				} else if (wind_degrees <= 304) {
					wind_dir = "WNW";
				} else if (wind_degrees <= 326) {
					wind_dir = "NW";
				} else if (wind_degrees <= 349) {
					wind_dir = "NNW";
				}
				self.vDev2.set("metrics:icon","/ZAutomation/api/v1/load/modulemedia/Wunderground/" + wind_dir + ".png" );
				self.vDev.set("metrics:level", temp);
				self.vDev.set("metrics:windgust", windgust);
				self.vDev.set("metrics:pressure", pressure);
				self.vDev.set("metrics:wind_degrees", wind_degrees);
				self.vDev2.set("metrics:level", wind_dir);
				self.vDev.set("metrics:timeStamp", observe_time);
				self.vDev2.set("metrics:timeStamp", observe_time);
				self.vDev.set("metrics:max_temp", max_temp);
				self.vDev.set("metrics:icon", icon);
			} catch (e) {
				self.controller.addNotification("error", langFile.err_parse, "module", moduleName);
			}
		},
		error : function () {
			self.controller.addNotification("error", langFile.err_fetch, "module", moduleName);
		}
	});
};
