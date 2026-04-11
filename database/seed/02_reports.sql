INSERT INTO reports (
    reporter_id,
    report_type,
    alert,
    title,
    description,
    status,
    created_at,
    updated_at
) VALUES
(1, 'narrow_road', 'medium', 'Road Crack and Pothole on Mirpur Road','Arnob reporting a series of potholes and visible road cracks along Mirpur Road near intersection 7. The damage spans approximately 40 meters and poses a risk to vehicles and cyclists. Residents have complained about the issue for two weeks. Immediate patching and road assessment requested.','pending',CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'dust', 'normal', 'Broken Street Lights on Dhanmondi Avenue','Sajid reporting that 6 consecutive street lights on Dhanmondi Avenue have been non-functional for over 10 days. The dark stretch has raised safety concerns among pedestrians at night. Two minor incidents have already been reported in the area. Requesting urgent inspection and bulb/wiring replacement.','in_progress',CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'dust', 'medium', 'Illegal Waste Dumping Near Residential Block 4','Arnob reporting unauthorized waste dumping at the vacant lot adjacent to Residential Block 4. Large volumes of construction debris and household waste have been accumulating over the past week. The site is attracting pests and producing foul odor. Requesting waste removal and placement of no-dumping signage.','pending',CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'narrow_road', 'normal', 'Damaged Public Bench and Broken Pathway Tiles in City Park','Rashed reporting vandalized benches and several broken tiles along the main walkway in City Park. The damage is a tripping hazard for elderly visitors and children. The reported area is near the fountain plaza. Requesting maintenance crew deployment for repairs and replacement.','resolved',CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'flood', 'high', 'Blocked Drainage Causing Waterlogging on Gulshan Street','Fuad reporting a severely clogged drainage canal on Gulshan Street that has caused persistent waterlogging after light rainfall. Affected area spans roughly 60 meters and disrupts daily traffic and pedestrian movement. Nearby shops have reported water entering their premises. Urgent drain cleaning and inspection requested.','in_progress',CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'narrow_road', 'medium', 'Damaged Traffic Sign Post at Central Roundabout',NULL,'pending',CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
