select oil.Year,oil.[Corporate Entity],oil.[Pipeline Name],oil.[Key Point],oil.[Direction of Flow],oil.[Trade Type],oil.Product,
avg(oil.[Throughput (1000 m3/d)]) as [Throughput (1000 m3/d)],avg(oil.[Available Capacity (1000 m3/d)]) as [Available Capacity (1000 m3/d)]
from (SELECT throughput.[Month],throughput.[Year],throughput.[Corporate Entity],throughput.[Pipeline Name],throughput.[Key Point],
[Direction of Flow],[Trade Type],[Product],[Throughput (1000 m3/d)],
capacity.[Available Capacity (1000 m3/d)] FROM [EnergyData].[dbo].[Pipelines_Throughput_Oil] as throughput
left join [EnergyData].[dbo].[Pipelines_Capacity_Oil] as capacity on throughput.Year = capacity.Year and throughput.Month = capacity.Month
and throughput.[Corporate Entity] = capacity.[Corporate Entity] and throughput.[Pipeline Name] = capacity.[Pipeline Name]
and throughput.[Key Point] = capacity.[Key Point] where throughput.[Corporate Entity] <> 'Trans Mountain Pipeline ULC' and throughput.Year = '2019'
union all
SELECT throughput.[Month],throughput.[Year],throughput.[Corporate Entity],throughput.[Pipeline Name],throughput.[Key Point],
[Direction of Flow],[Trade Type],[Product],[Throughput (1000 m3/d)],
capacity.[Available Capacity (1000 m3/d)]
FROM [EnergyData].[dbo].[Pipelines_Throughput_Oil] as throughput
left join [EnergyData].[dbo].[Pipelines_Capacity_Oil] as capacity on throughput.Year = capacity.Year and throughput.Month = capacity.Month
and throughput.[Corporate Entity] = capacity.[Corporate Entity] and throughput.[Pipeline Name] = capacity.[Pipeline Name]
where throughput.[Corporate Entity] = 'Trans Mountain Pipeline ULC' and throughput.Year = '2019'
) as oil group by [Year],[Corporate Entity],[Pipeline Name],[Key Point],[Direction of Flow],[Trade Type],Product