import csv,io,json,zipfile,re,html
from pathlib import Path
from decimal import Decimal

rows=list(csv.DictReader(io.StringIO(zipfile.ZipFile(r'C:\Users\USER\Downloads\products_export.zip').read('products_export.csv').decode('utf-8-sig'))))
selected_handles=[
    '🐱-cute-cat-backpack-with-built-in-meow-sound-🔊',
    'probent-wide-neck-baby-bottles-choose-your-favorite-design-size-for-your-little-one',
]
def plain(value):
    value=re.sub(r'<(script|style)\b[^>]*>.*?</\1>','',value,flags=re.S|re.I)
    return html.unescape(re.sub('<[^>]+>',' ',value)).strip()
def money(value):return int(Decimal(value or '0')*100)
products=[]
for handle in selected_handles:
    index,row=next((i,r) for i,r in enumerate(rows) if r['Handle']==handle and r['Title'])
    group=[r for r in rows if r['Handle']==row['Handle']]
    name=re.sub(r'\s*[\[(]free home delivery[\])]','',row['Title'],flags=re.I).strip()
    images=list(dict.fromkeys(r['Image Src'] for r in group if r['Image Src']))
    variants=[r for r in group if r['Variant Price']]
    products.append(dict(handle=row['Handle'],name=name,description=re.sub(r'\s+',' ',plain(row['Body (HTML)'])),price=money(row['Variant Price']),compare_at=money(row['Variant Compare At Price']) or None,sku=row['Variant SKU'] or 'IMPORT-'+str(index),stock=max(0,int(row['Variant Inventory Qty'] or 0)),images=images,variants=[dict(name=' / '.join(r[k] for k in ['Option1 Value','Option2 Value','Option3 Value'] if r[k]),sku=r['Variant SKU'],price=money(r['Variant Price']),stock=max(0,int(r['Variant Inventory Qty'] or 0))) for r in variants],category=row['Type'] or 'Everyday essentials'))
products.insert(0,dict(handle='rechargeable-electric-heating-pad-for-period-pain-relief-heated-waist-belly-belt-for-women-girls',name='Rechargeable Electric Heating Pad for Period Pain Relief',description='A portable rechargeable waist and belly belt with three adjustable heat levels and four massage modes for soothing menstrual cramps, lower-back discomfort and muscle tension.',price=249900,compare_at=349900,sku='PKTM-HEAT-PAD',stock=5,images=['https://cdn.shopify.com/s/files/1/0657/6062/4867/products/6fcca45bde6900ef7b350c127032dfb0.jpg?v=1666375312'],variants=[],category='Health & Personal Care'))
Path('scripts/import-selection.json').write_text(json.dumps(products,indent=2),encoding='utf-8')
print(json.dumps([dict(name=p['name'],handle=p['handle'],price=p['price'],stock=p['stock'],variants=p['variants'],images=p['images'][:1]) for p in products],indent=2))
