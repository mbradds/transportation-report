
select 
rail.Date,
rail.Units,
rail.Volume,
wcs.[WCS Differential]

from
(

SELECT 
[Date],
[Volume],
[Units]

FROM [EnergyData].[dbo].[NEB_RailExports_Oil] 
where Units in ('bbl per day','m3 per day')

--order by [Units],[Date]
) as rail

left join

(
SELECT 
year([SettlementDate]) as [Year],
month([SettlementDate]) as [Month],
round(avg([SettlementValue]),2)*-1 as [WCS Differential]

FROM [EnergyData].[dbo].[Net_Energy_Spot]

where Market = 'WCS'

group by year([SettlementDate]),month([SettlementDate])
) as wcs

on year(rail.Date) = wcs.Year and month(rail.Date) = wcs.Month

order by rail.Units, rail.Date
