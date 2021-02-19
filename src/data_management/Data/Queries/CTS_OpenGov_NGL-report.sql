SELECT cast(ReportingPeriod as date) as [Period], YEAR(ReportingPeriod) as [Year], DATENAME(month, ReportingPeriod) as [Month], 
[Commodity] as [Product], [Export Origin] as [Origin], 
CASE WHEN Padd = 'PADD VI' THEN 'Other' ELSE Padd END as [Destination / PADD], 
TransportMode as [Mode of Transportation],
[Volume (m3)], [Volume (bbl)], [Value (CN$)], [Value (US$)], [Price (CN cents/litre)], [Price (US cents/gallon)]

FROM (

SELECT FL.ReportingPeriod, CM.DisplayValue as [Commodity], --CM.FrenchDisplayValue,
FG.Name as [Export Origin], -- FG.FrenchName
RTrim(TG.PADDName) Padd,
CASE TType.Name WHEN 'Pipeline' THEN TType.Name ELSE T.Name END TransportMode , -- T.FrenchName instead of T.Name
-1 * sum(Volume) AS [Volume (m3)], 
-1 * sum(Volume) * 6.2898 AS [Volume (bbl)],
-1 * sum(Price * Volume) * 10 as [Value (CN$)], 
-1 * sum(CASE WHEN Rate IS NULL THEN NULL ELSE [Price] * Volume / Rate END) * 10 as [Value (US$)], 
sum(Price * Volume) / sum(Volume) as [Price (CN cents/litre)],
sum(CASE WHEN Rate IS NULL THEN NULL ELSE [Price] * Volume / Rate END) / sum(Volume) * 3.7854 as [Price (US cents/gallon)]
FROM    [ActivityLineItem] ActLineItem
		INNER JOIN [FilingStatus] FS ON FS.FilingStatusId = ActLineItem.FilingStatusId
		INNER JOIN [Filing] FL ON FL.FilingId = FS.FilingId
		INNER JOIN [Commodity] CM ON CM.CommodityId = FL.CommodityId
		INNER JOIN [Transport] T ON T.TransportId = ActLineItem.TransportId
		INNER JOIN [TransportType] TType ON TType.TransportTypeId = T.TransportTypeId
		INNER JOIN [PublicReportStatus] PRS ON PRS.CommodityId = CM.CommodityId AND PRS.ReportingPeriod = FL.ReportingPeriod
		INNER JOIN vwLocation FG ON FG.LocationId = ActLineItem.FromLocationId
		INNER JOIN vwLocation TG ON TG.LocationId = ISNULL(ActLineItem.ToLocationId, ActLineItem.ToCountryId)
		LEFT OUTER JOIN dbo.ExchangeRate ER ON ER.Period = FL.ReportingPeriod
WHERE  ActivityTypeID = 3 AND PRS.IsPublished = 1 AND FS.StatusTypeID = 5 AND CM.CommodityCode in ('BU', 'PR', 'ET')
GROUP  BY FL.ReportingPeriod, CM.DisplayValue, FG.Name, TG.PADDName, CASE TType.Name WHEN 'Pipeline' THEN TType.Name ELSE T.Name END
UNION ALL
SELECT FL.ReportingPeriod, CM.DisplayValue as [Commodity], --CM.FrenchDisplayValue,
FG.Name as [Export Origin], -- FG.FrenchName
RTrim(TG.PADDName) Padd,
'Total' as TransportMode,
-1 * sum(Volume) AS [Volume (m3)], 
-1 * sum(Volume) * 6.2898 AS [Volume (bbl)],
-1 * sum(Price * Volume) * 10 as [Value (CN$)], 
-1 * sum(CASE WHEN Rate IS NULL THEN NULL ELSE [Price] * Volume / Rate END) *10 as [Value (US$)], 
sum(Price * Volume) / sum(Volume) as [Price (CN cents/litre)],
sum(CASE WHEN Rate IS NULL THEN NULL ELSE [Price] * Volume / Rate END) / sum(Volume) * 3.7854 as [Price (US cents/gallon)]
FROM    [ActivityLineItem] ActLineItem
		INNER JOIN [FilingStatus] FS ON FS.FilingStatusId = ActLineItem.FilingStatusId
		INNER JOIN [Filing] FL ON FL.FilingId = FS.FilingId
		INNER JOIN [Commodity] CM ON CM.CommodityId = FL.CommodityId
		INNER JOIN [PublicReportStatus] PRS ON PRS.CommodityId = CM.CommodityId AND PRS.ReportingPeriod = FL.ReportingPeriod
		INNER JOIN vwLocation FG ON FG.LocationId = ActLineItem.FromLocationId
		INNER JOIN vwLocation TG ON TG.LocationId = ISNULL(ActLineItem.ToLocationId, ActLineItem.ToCountryId)
		LEFT OUTER JOIN dbo.ExchangeRate ER ON ER.Period = FL.ReportingPeriod
WHERE  ActivityTypeID = 3 AND PRS.IsPublished = 1 AND FS.StatusTypeID = 5 AND CM.CommodityCode in ('BU', 'PR', 'ET')
GROUP  BY FL.ReportingPeriod, CM.DisplayValue, FG.Name, TG.PADDName
UNION ALL 
SELECT FL.ReportingPeriod, CM.DisplayValue as [Commodity], --CM.FrenchDisplayValue,
FG.Name as [Export Origin], -- FG.FrenchName
'Total' as Padd,
CASE TType.Name WHEN 'Pipeline' THEN TType.Name ELSE T.Name END TransportMode , -- T.FrenchName instead of T.Name
-1 * sum(Volume) AS [Volume (m3)], 
-1 * sum(Volume) * 6.2898 AS [Volume (bbl)],
-1 * sum(Price * Volume) * 10 as [Value (CN$)], 
-1 * sum(CASE WHEN Rate IS NULL THEN NULL ELSE [Price] * Volume / Rate END) *10 as [Value (US$)], 
sum(Price * Volume) / sum(Volume) as [Price (CN cents/litre)],
sum(CASE WHEN Rate IS NULL THEN NULL ELSE [Price] * Volume / Rate END) / sum(Volume) * 3.7854 as [Price (US cents/gallon)]
FROM    [ActivityLineItem] ActLineItem
		INNER JOIN [FilingStatus] FS ON FS.FilingStatusId = ActLineItem.FilingStatusId
		INNER JOIN [Filing] FL ON FL.FilingId = FS.FilingId
		INNER JOIN [Commodity] CM ON CM.CommodityId = FL.CommodityId
		INNER JOIN [Transport] T ON T.TransportId = ActLineItem.TransportId
		INNER JOIN [TransportType] TType ON TType.TransportTypeId = T.TransportTypeId
		INNER JOIN [PublicReportStatus] PRS ON PRS.CommodityId = CM.CommodityId AND PRS.ReportingPeriod = FL.ReportingPeriod
		INNER JOIN vwLocation FG ON FG.LocationId = ActLineItem.FromLocationId
		INNER JOIN vwLocation TG ON TG.LocationId = ISNULL(ActLineItem.ToLocationId, ActLineItem.ToCountryId)
		LEFT OUTER JOIN dbo.ExchangeRate ER ON ER.Period = FL.ReportingPeriod
WHERE  ActivityTypeID = 3 AND PRS.IsPublished = 1 AND FS.StatusTypeID = 5 AND CM.CommodityCode in ('BU', 'PR', 'ET')
GROUP  BY FL.ReportingPeriod, CM.DisplayValue, FG.Name, CASE TType.Name WHEN 'Pipeline' THEN TType.Name ELSE T.Name END
UNION ALL
SELECT FL.ReportingPeriod, CM.DisplayValue as [Commodity], --CM.FrenchDisplayValue,
FG.Name as [Export Origin], -- FG.FrenchName
'Total' as Padd,
'Total' as TransportMode,
-1 * sum(Volume) AS [Volume (m3)], 
-1 * sum(Volume) * 6.2898 AS [Volume (bbl)],
-1 * sum(Price * Volume) * 10 as [Value (CN$)], 
-1 * sum(CASE WHEN Rate IS NULL THEN NULL ELSE [Price] * Volume / Rate END) *10 as [Value (US$)], 
sum(Price * Volume) / sum(Volume) as [Price (CN cents/litre)],
sum(CASE WHEN Rate IS NULL THEN NULL ELSE [Price] * Volume / Rate END) / sum(Volume) * 3.7854 as [Price (US cents/gallon)]
FROM    [ActivityLineItem] ActLineItem
		INNER JOIN [FilingStatus] FS ON FS.FilingStatusId = ActLineItem.FilingStatusId
		INNER JOIN [Filing] FL ON FL.FilingId = FS.FilingId
		INNER JOIN [Commodity] CM ON CM.CommodityId = FL.CommodityId
		INNER JOIN [PublicReportStatus] PRS ON PRS.CommodityId = CM.CommodityId AND PRS.ReportingPeriod = FL.ReportingPeriod
		INNER JOIN vwLocation FG ON FG.LocationId = ActLineItem.FromLocationId
		INNER JOIN vwLocation TG ON TG.LocationId = ISNULL(ActLineItem.ToLocationId, ActLineItem.ToCountryId)
		LEFT OUTER JOIN dbo.ExchangeRate ER ON ER.Period = FL.ReportingPeriod
WHERE  ActivityTypeID = 3 AND PRS.IsPublished = 1 AND FS.StatusTypeID = 5 AND CM.CommodityCode in ('BU', 'PR', 'ET')
GROUP  BY FL.ReportingPeriod, CM.DisplayValue, FG.Name

UNION ALL
-- total origin
SELECT FL.ReportingPeriod, CM.DisplayValue as [Commodity], --CM.FrenchDisplayValue,
'Total' as [Export Origin], -- FG.FrenchName
RTrim(TG.PADDName) Padd,
CASE TType.Name WHEN 'Pipeline' THEN TType.Name ELSE T.Name END TransportMode , -- T.FrenchName instead of T.Name
-1 * sum(Volume) AS [Volume (m3)], 
-1 * sum(Volume) * 6.2898 AS [Volume (bbl)],
-1 * sum(Price * Volume) * 10 as [Value (CN$)], 
-1 * sum(CASE WHEN Rate IS NULL THEN NULL ELSE [Price] * Volume / Rate END) *10 as [Value (US$)], 
sum(Price * Volume) / sum(Volume) as [Price (CN cents/litre)],
sum(CASE WHEN Rate IS NULL THEN NULL ELSE [Price] * Volume / Rate END) / sum(Volume) * 3.7854 as [Price (US cents/gallon)]
FROM    [ActivityLineItem] ActLineItem
		INNER JOIN [FilingStatus] FS ON FS.FilingStatusId = ActLineItem.FilingStatusId
		INNER JOIN [Filing] FL ON FL.FilingId = FS.FilingId
		INNER JOIN [Commodity] CM ON CM.CommodityId = FL.CommodityId
		INNER JOIN [Transport] T ON T.TransportId = ActLineItem.TransportId
		INNER JOIN [TransportType] TType ON TType.TransportTypeId = T.TransportTypeId
		INNER JOIN [PublicReportStatus] PRS ON PRS.CommodityId = CM.CommodityId AND PRS.ReportingPeriod = FL.ReportingPeriod
		INNER JOIN vwLocation FG ON FG.LocationId = ActLineItem.FromLocationId
		INNER JOIN vwLocation TG ON TG.LocationId = ISNULL(ActLineItem.ToLocationId, ActLineItem.ToCountryId)
		LEFT OUTER JOIN dbo.ExchangeRate ER ON ER.Period = FL.ReportingPeriod
WHERE  ActivityTypeID = 3 AND PRS.IsPublished = 1 AND FS.StatusTypeID = 5 AND CM.CommodityCode in ('BU', 'PR', 'ET')
GROUP  BY FL.ReportingPeriod, CM.DisplayValue, TG.PADDName, CASE TType.Name WHEN 'Pipeline' THEN TType.Name ELSE T.Name END
UNION ALL
SELECT FL.ReportingPeriod, CM.DisplayValue as [Commodity], --CM.FrenchDisplayValue,
'Total' as [Export Origin], -- FG.FrenchName
RTrim(TG.PADDName) Padd,
'Total' as TransportMode,
-1 * sum(Volume) AS [Volume (m3)], 
-1 * sum(Volume) * 6.2898 AS [Volume (bbl)],
-1 * sum(Price * Volume) * 10 as [Value (CN$)], 
-1 * sum(CASE WHEN Rate IS NULL THEN NULL ELSE [Price] * Volume / Rate END) *10 as [Value (US$)], 
sum(Price * Volume) / sum(Volume) as [Price (CN cents/litre)],
sum(CASE WHEN Rate IS NULL THEN NULL ELSE [Price] * Volume / Rate END) / sum(Volume) * 3.7854 as [Price (US cents/gallon)]
FROM    [ActivityLineItem] ActLineItem
		INNER JOIN [FilingStatus] FS ON FS.FilingStatusId = ActLineItem.FilingStatusId
		INNER JOIN [Filing] FL ON FL.FilingId = FS.FilingId
		INNER JOIN [Commodity] CM ON CM.CommodityId = FL.CommodityId
		INNER JOIN [PublicReportStatus] PRS ON PRS.CommodityId = CM.CommodityId AND PRS.ReportingPeriod = FL.ReportingPeriod
		INNER JOIN vwLocation FG ON FG.LocationId = ActLineItem.FromLocationId
		INNER JOIN vwLocation TG ON TG.LocationId = ISNULL(ActLineItem.ToLocationId, ActLineItem.ToCountryId)
		LEFT OUTER JOIN dbo.ExchangeRate ER ON ER.Period = FL.ReportingPeriod
WHERE  ActivityTypeID = 3 AND PRS.IsPublished = 1 AND FS.StatusTypeID = 5 AND CM.CommodityCode in ('BU', 'PR', 'ET')
GROUP  BY FL.ReportingPeriod, CM.DisplayValue, TG.PADDName
UNION ALL 
SELECT FL.ReportingPeriod, CM.DisplayValue as [Commodity], --CM.FrenchDisplayValue,
'Total' as [Export Origin], -- FG.FrenchName
'Total' as Padd,
CASE TType.Name WHEN 'Pipeline' THEN TType.Name ELSE T.Name END TransportMode , -- T.FrenchName instead of T.Name
-1 * sum(Volume) AS [Volume (m3)], 
-1 * sum(Volume) * 6.2898 AS [Volume (bbl)],
-1 * sum(Price * Volume) * 10 as [Value (CN$)], 
-1 * sum(CASE WHEN Rate IS NULL THEN NULL ELSE [Price] * Volume / Rate END) *10 as [Value (US$)], 
sum(Price * Volume) / sum(Volume) as [Price (CN cents/litre)],
sum(CASE WHEN Rate IS NULL THEN NULL ELSE [Price] * Volume / Rate END) / sum(Volume) * 3.7854 as [Price (US cents/gallon)]
FROM    [ActivityLineItem] ActLineItem
		INNER JOIN [FilingStatus] FS ON FS.FilingStatusId = ActLineItem.FilingStatusId
		INNER JOIN [Filing] FL ON FL.FilingId = FS.FilingId
		INNER JOIN [Commodity] CM ON CM.CommodityId = FL.CommodityId
		INNER JOIN [Transport] T ON T.TransportId = ActLineItem.TransportId
		INNER JOIN [TransportType] TType ON TType.TransportTypeId = T.TransportTypeId
		INNER JOIN [PublicReportStatus] PRS ON PRS.CommodityId = CM.CommodityId AND PRS.ReportingPeriod = FL.ReportingPeriod
		INNER JOIN vwLocation FG ON FG.LocationId = ActLineItem.FromLocationId
		INNER JOIN vwLocation TG ON TG.LocationId = ISNULL(ActLineItem.ToLocationId, ActLineItem.ToCountryId)
		LEFT OUTER JOIN dbo.ExchangeRate ER ON ER.Period = FL.ReportingPeriod
WHERE  ActivityTypeID = 3 AND PRS.IsPublished = 1 AND FS.StatusTypeID = 5 AND CM.CommodityCode in ('BU', 'PR', 'ET')
GROUP  BY FL.ReportingPeriod, CM.DisplayValue, CASE TType.Name WHEN 'Pipeline' THEN TType.Name ELSE T.Name END
UNION ALL
SELECT FL.ReportingPeriod, CM.DisplayValue as [Commodity], --CM.FrenchDisplayValue,
'Total' as [Export Origin], -- FG.FrenchName
'Total' as Padd,
'Total' as TransportMode,
-1 * sum(Volume) AS [Volume (m3)], 
-1 * sum(Volume) * 6.2898 AS [Volume (bbl)],
-1 * sum(Price * Volume) * 10 as [Value (CN$)], 
-1 * sum(CASE WHEN Rate IS NULL THEN NULL ELSE [Price] * Volume / Rate END) *10 as [Value (US$)], 
sum(Price * Volume) / sum(Volume) as [Price (CN cents/litre)],
sum(CASE WHEN Rate IS NULL THEN NULL ELSE [Price] * Volume / Rate END) / sum(Volume) * 3.7854 as [Price (US cents/gallon)]
FROM    [ActivityLineItem] ActLineItem
		INNER JOIN [FilingStatus] FS ON FS.FilingStatusId = ActLineItem.FilingStatusId
		INNER JOIN [Filing] FL ON FL.FilingId = FS.FilingId
		INNER JOIN [Commodity] CM ON CM.CommodityId = FL.CommodityId
		INNER JOIN [PublicReportStatus] PRS ON PRS.CommodityId = CM.CommodityId AND PRS.ReportingPeriod = FL.ReportingPeriod
		INNER JOIN vwLocation FG ON FG.LocationId = ActLineItem.FromLocationId
		INNER JOIN vwLocation TG ON TG.LocationId = ISNULL(ActLineItem.ToLocationId, ActLineItem.ToCountryId)
		LEFT OUTER JOIN dbo.ExchangeRate ER ON ER.Period = FL.ReportingPeriod
WHERE  ActivityTypeID = 3 AND PRS.IsPublished = 1 AND FS.StatusTypeID = 5 AND CM.CommodityCode in ('BU', 'PR', 'ET')
GROUP  BY FL.ReportingPeriod, CM.DisplayValue

) T

ORDER BY [Period], [Commodity], 
CASE WHEN [Export Origin] = 'Total' THEN 'ZZZ' ELSE [Export Origin] END,
CASE WHEN [Padd] = 'Total' THEN 'ZZZ' ELSE [Padd] END, 
CASE WHEN [TransportMode] = 'Total' THEN 'ZZZ' ELSE [TransportMode] END
