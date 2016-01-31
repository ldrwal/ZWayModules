##SolQoS

This module calculates the combined wattage of two solar power inverters. These data are taken from two instances of the PVLogger module. If any of the inverters wattage drops below 40% of the combined wattage, an error status is generated. The module icon is dynamic. It displays which power inverter may be in error.  
Apart from this status icon, combined daily energy production is available as a virtualDevice metric.  
Caveat: Since both inverters send their data at different times, the module may produce false warnings, especially on cloudy days. Nevertheless it has proven to be useful in detecting sporadic errors.