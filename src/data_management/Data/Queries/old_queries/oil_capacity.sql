select [Date],[Corporate Entity],[Pipeline Name],[Key Point],
rtrim(ltrim(LEFT([Units], Charindex('(', [Units]) - 1))) as [Capacity Type],
ltrim(Right([Units], Charindex('(', [Units]))) as [Units],
[Capacity]
from(
SELECT 
cast(cast([Month] as nvarchar(2))+'-'+'1'+'-'+cast([Year] as nvarchar(4)) as date) as [Date],  
[Corporate Entity],
[Pipeline Name],
[Key Point],
round([Nameplate Capacity (1000 m3/d)],2) as [Nameplate Capacity (1000 m3/d)],
round([Available Capacity (1000 m3/d)],2) as [Available Capacity (1000 m3/d)],
round([Nameplate Capacity (1000 m3/d)]*6.2898,2) as [Nameplate Capacity (1000 b/d)],
round([Available Capacity (1000 m3/d)]*6.2898,2) as [Available Capacity (1000 b/d)]
FROM [EnergyData].[dbo].[Pipelines_Capacity_Oil]
where ([Pipeline Name] = 'Canadian Mainline' and [Key Point] in ('ex-Gretna','Into-Sarnia')) or ([Pipeline Name] <> 'Canadian Mainline')
) as unTidy
unpivot
(Capacity FOR Units in ([Nameplate Capacity (1000 m3/d)],[Available Capacity (1000 m3/d)],[Nameplate Capacity (1000 b/d)],[Available Capacity (1000 b/d)])
) as tidy
order by [Pipeline Name],[Corporate Entity],[Key Point],[Date]