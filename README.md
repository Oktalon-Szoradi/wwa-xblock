# wwa-xblock
Component which communicates with that server* to run C# code...  
This is what students of the Wien West Akademie platform will see.

ToDo:
- Syntax highlighting
- Line numbering
- Auto-indentation

## *this here:
https://github.com/Oktalon-Szoradi/csharp-exec-server

## XBlock Documentation
https://edx.readthedocs.io/projects/xblock-tutorial/en/latest/getting_started/index.html

## Info
`wwacodingenvxblock/static/` contains
the HTML, CSS, and JS.  

## How to Start
That lil text file (`HowToStartThing.txt`) is meh now. I think I finally figured out how to do it now:  
(You should be on a Linux distro!)  
(Assuming you have all the dependencies, like Python 3.8)

1. Create the Virtual Environment  
```bash
$ virtualenv venv
```
2. Activate the Virtual Environment
```bash
$ source venv/bin/activate
```
3. Clone the XBlock SDK repository from GitHub, if you haven't already
```bash
(venv) $ git clone https://github.com/openedx/xblock-sdk.git
```
4. After installing the XBlock SDK, enter it and create a directory `var`
```bash
(venv) $ cd xblock-sdk
(venv) $ mkdir var
```
5. Install the XBlock SDK requirements
```bash
(venv) $ make install
```
6. Return to the parent directory and install my XBlock (assuming you have the folder `wwacodingenvxblock` which is here in this repo)
```bash
(venv) $ cd ..
(venv) $ pip install -e wwacodingenvxblock
```
7. Finally, run the server
```bash
(venv) $ python3 xblock-sdk/manage.py runserver
```

You should see an output similar to the following:  
```
Performing system checks...

System check identified no issues (0 silenced).
February 12, 2024 - 15:55:30
Django version 3.2.23, using settings 'workbench.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

You can access the XBlock at:  
http://127.0.0.1:8000/scenario/wwacodingenvxblock.0/  
or  
http://localhost:8000/scenario/wwacodingenvxblock.0/

## Wien West Akademie Information Repository Link
https://github.com/Oktalon-Szoradi/wien-west-akademie
