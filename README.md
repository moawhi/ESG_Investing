# P13 - ESG Management System (Web Application) for FinTech Industry

## Running the server
To run the server, in the root directory, run
```
python3 backend/src/server.py
```
or

```
python3 -m backend.src.server
```
If you get an OSError saying the address is already in use, in `backend/src/server.py` change `PORT` to use a different port number.

Please ensure you have Flask installed to run the server.