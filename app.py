import os

from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/table-builder/')
def table_builder():
    return render_template('table-builder.html')

@app.route('/document-embed/')
def document_embed():
    return render_template('document-embed.html')

@app.route('/map-builder/')
def map_builder():
    return render_template('map-builder.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
