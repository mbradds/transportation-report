select [Date],[Capacity],[import] as [Imports],[export] as [Exports]
from (SELECT cast(str(gas.Month)+'-'+'1'+'-'+str(gas.Year) as date) as [Date],gas.[Trade Type],
round(avg(gas.[Capacity (1000 m3/d)]/1000),1) as [Capacity],
round(avg(gas.[Throughput (1000 m3/d)]/1000),1) as [Throughput]
FROM [EnergyData].[dbo].[Pipelines_Gas] as gas
where  gas.[Corporate Entity]='Maritimes & Northeast Pipeline' and gas.[Pipeline Name] = 'Canadian Mainline'
and gas.Year >= '2009'
group by gas.Year,gas.Month, gas.[Trade Type]) as mnp pivot
(avg([Throughput]) for [Trade Type] in ([import],[export])) as mnp_untidy order by [Date]