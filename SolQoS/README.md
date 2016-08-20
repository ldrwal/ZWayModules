##SolQoS    
This module calculates the combined wattage of two solar power inverters. These data are taken from two instances of the PVLogger module. If any of the inverters wattage drops below 40% of the combined wattage, an error status is generated. The module icon is dynamic. It displays which power inverter may be in error.  
Apart from this status icon, combined daily energy production is available as a virtualDevice metric.  
Caveat: Since both inverters send their data at different times, the module may produce false warnings, especially on cloudy days. Nevertheless it has proven to be useful in detecting sporadic errors.  
Note: At system restart you may get an error message. This is due to the fact that the PVLoggers do not yet have data at that moment. Nothing to worry about.
####Testing    
This module can be tested with two instances of the PVLogger module. See README.md of PVLogger for dummy test data.
##License    
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or any later version.    
This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.    