import os
from flask import Flask, render_template, request, send_from_directory, abort

buildfolder = "www/"
app = Flask(__name__, template_folder=buildfolder )

@app.route("/")
def get_root():
    return render_template("index.html")

@app.route('/<path:path>')
def serve_file(path=''):
    file_path = os.path.join('www/', path)

    if os.path.isfile(file_path):
        return send_from_directory('www/', path)
    elif os.path.isdir(file_path):
        index_path = os.path.join(file_path, 'index.html')
        if os.path.isfile(index_path):
            return send_from_directory(file_path, 'index.html')
    abort(404)



# FROM THIS POINT YOU CAN'T SETUP ROUTES ANYMORE AND THE FLASK SERVER WILL NOT RESTART
if __name__ == '__main__':
    app.run(debug=True, port="9999")