import csv,io,json,zipfile,re,html
from pathlib import Path
from decimal import Decimal

rows=list(csv.DictReader(io.StringIO(zipfile.ZipFile(r'C:\Users\USER\Downloads\products_export.zip').read('products_export.csv').decode('utf-8-sig'))))
selected=[136,373,63,192,270,372]
def plain(value):
    value=re.sub(r'<(script|style)\b[^>]*>.*?</\1>','',value,flags=re.S|re.I)
    return html.unescape(re.sub('<[^>]+>',' ',value)).strip()
def money(value):return int(Decimal(value or '0')*100)
products=[]
for index in selected:
    row=rows[index];group=[r for r in rows if r['Handle']==row['Handle']]
    name=re.sub(r'\s*[\[(]free home delivery[\])]','',row['Title'],flags=re.I).strip()
    images=list(dict.fromkeys(r['Image Src'] for r in group if r['Image Src']))
    variants=[r for r in group if r['Variant Price']]
    products.append(dict(handle=row['Handle'],name=name,description=re.sub(r'\s+',' ',plain(row['Body (HTML)'])),price=money(row['Variant Price']),compare_at=money(row['Variant Compare At Price']) or None,sku=row['Variant SKU'] or 'IMPORT-'+str(index),stock=max(0,int(row['Variant Inventory Qty'] or 0)),images=images,variants=[dict(name=' / '.join(r[k] for k in ['Option1 Value','Option2 Value','Option3 Value'] if r[k]),sku=r['Variant SKU'],price=money(r['Variant Price']),stock=max(0,int(r['Variant Inventory Qty'] or 0))) for r in variants],category=row['Type'] or 'Everyday essentials'))
Path('scripts/import-selection.json').write_text(json.dumps(products,indent=2),encoding='utf-8')
print(json.dumps([dict(name=p['name'],handle=p['handle'],price=p['price'],stock=p['stock'],variants=p['variants'],images=p['images'][:1]) for p in products],indent=2))
