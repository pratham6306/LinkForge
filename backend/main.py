from fastapi import FastAPI

app = FastAPI()

@app.get('/')
def home():
    return{
        'message': "Url Shortner API is running"
    }