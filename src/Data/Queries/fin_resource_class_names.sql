SELECT 
[ALL Class],
[Company]
FROM [EnergyData].[dbo].[Pipeline_Fin_Resource] as fin
where variable = 'ALL Limit' and [ALL Class] not in ('CO2 or Water Class','Commodity class 1')
order by [ALL Class], fin.[values], [Company]