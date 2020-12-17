import geopandas as gpd
import os
script_dir = os.path.dirname(__file__)
os.chdir(script_dir)


def getHCMap():
    link = 'https://code.highcharts.com/mapdata/countries/us/custom/us-all-mainland.geo.json'
    df = gpd.read_file(link)
    padds = {"us-me":"PADD 1",
            "us-vt": "PADD 1",
            "us-nh": "PADD 1",
            "us-ma": "PADD 1",
            "us-ct": "PADD 1",
            "us-ri": "PADD 1",
            "us-ny": "PADD 1",
            "us-pa": "PADD 1",
            "us-nj": "PADD 1",
            "us-de": "PADD 1",
            'us-dc': "PADD 1",
            "us-md": "PADD 1",
            "us-wv": "PADD 1",
            "us-va": "PADD 1",
            "us-nc": "PADD 1",
            "us-sc": "PADD 1",
            "us-ga": "PADD 1",
            "us-fl": "PADD 1",
            "us-nd": "PADD 2",
            "us-sd": "PADD 2",
            "us-ne": "PADD 2",
            "us-ks": "PADD 2",
            "us-ok": "PADD 2",
            "us-mn": "PADD 2",
            "us-ia": "PADD 2",
            "us-mo": "PADD 2",
            "us-wi": "PADD 2",
            "us-il": "PADD 2",
            "us-mi": "PADD 2",
            "us-in": "PADD 2",
            "us-ky": "PADD 2",
            "us-tn": "PADD 2",
            "us-oh": "PADD 2",
            "us-tx": "PADD 3",
            "us-la": "PADD 3",
            "us-nm": "PADD 3",
            "us-ms": "PADD 3",
            "us-al": "PADD 3",
            "us-ar": "PADD 3",
            "us-mt": "PADD 4",
            "us-id": "PADD 4",
            "us-ut": "PADD 4",
            "us-co": "PADD 4",
            "us-wy": "PADD 4",
            "us-wa": "PADD 5",
            "us-or": "PADD 5",
            "us-ca": "PADD 5",
            "us-nv": "PADD 5",
            "us-az": "PADD 5"}
    
    df['PADD'] = [padds[x] for x in df['hc-key']]
    delete_cols = ['id',
                   'hc-group',
                   'hc-middle-x',
                   'hc-middle-y',
                   'hc-key',
                   'hc-a2',
                   'labelrank',
                   'hasc',
                   'woe-id',
                   'state-fips',
                   'fips',
                   'postal-code',
                   'name',
                   'country',
                   'region',
                   'longitude',
                   'woe-name',
                   'latitude',
                   'woe-label',
                   'type']
    
    for delete in delete_cols:
        del df[delete]
    
    df = df.dissolve(by="PADD")
    df = df.reset_index()
    return df

def export_files(df,folder="Data",name="paddMap.geojson"):
    df = df[~df.geometry.is_empty]
    df = df[df.geometry.notna()]
    write_path = os.path.join(os.getcwd(),folder,name)
    df.to_file(write_path, driver='GeoJSON')


if __name__ == "__main__":
    df = getHCMap()
    export_files(df)
    df.plot()