SELECT 
cast(str(gas.Month)+'-'+'1'+'-'+str(gas.Year) as date) as [Date],
gas.[Trade Type],
round(avg(gas.[Capacity (1000 m3/d)]/1000),2) as [Capacity (million m3/d)],
round(avg(gas.[Throughput (1000 m3/d)]/1000),2) as [Throughput (million m3/d)]
FROM [EnergyData].[dbo].[Pipelines_Gas] as gas
where  gas.[Corporate Entity]='Maritimes & Northeast Pipeline' and gas.[Pipeline Name] = 'Canadian Mainline'
group by gas.Year,gas.Month, gas.[Trade Type]
order by cast(str(gas.Month)+'-'+'1'+'-'+str(gas.Year) as date), [Trade Type] 