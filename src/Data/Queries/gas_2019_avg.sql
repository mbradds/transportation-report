select * from (
SELECT [Year],[Corporate Entity],[Pipeline Name],[Key Point],[Trade Type],
case when [Trade Type] = 'import' then round(avg([Capacity (1000 m3/d)]/1000),2)*-1 
else round(avg([Capacity (1000 m3/d)]/1000),2) end as [Capacity],
case when [Trade Type] = 'import' then round(avg([Throughput (1000 m3/d)]/1000),2)*-1 
else round(avg([Throughput (1000 m3/d)]/1000),2) end as [Throughput] 
FROM [EnergyData].[dbo].[Pipelines_Gas] where
([Corporate Entity] = 'NOVA Gas Transmission Ltd. (NGTL)' and [Key Point] = 'Upstream of James River') or
([Corporate Entity] = 'NOVA Gas Transmission Ltd. (NGTL)' and [Key Point] = 'West Gate') or
([Corporate Entity] = 'TransCanada PipeLines Limited' and [Key Point] = 'Prairies') or
([Corporate Entity] = 'Westcoast Energy Inc.' and [Key Point] = 'Huntingdon Export') or 
([Corporate Entity] = 'Alliance Pipeline Limited Partnership' and [Key Point] = 'Border') or
([Corporate Entity] = 'TransCanada PipeLines Limited' and [Key Point] = 'Niagara' and [Trade Type] = 'import') or
([Corporate Entity] = 'TransCanada PipeLines Limited' and [Key Point] = 'Iroquois' and [Trade Type] = 'export') or
([Corporate Entity] = 'Maritimes & Northeast Pipeline' and [Key Point] = 'Baileyville, Ma. / St. Stephen N.B.' and [Trade Type] = 'import') or
([Corporate Entity] = 'Foothills Pipe Lines Ltd. (Foothills)' and [Key Point] = 'Monchy' and [Trade Type] = 'export') or
([Corporate Entity] = 'Foothills Pipe Lines Ltd. (Foothills)' and [Key Point] = 'Kingsgate' and [Trade Type] = 'export') 
group by [Year],[Corporate Entity],[Pipeline Name],[Key Point],[Trade Type]
) as gas_points
where [Year] >= 2015 and [Year] <> 2020