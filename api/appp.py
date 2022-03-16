# importing the required libraries
import json
import io
import glob
from PIL import Image
from torchvision import models
import torchvision.transforms as transforms
from flask import Flask
from flask import request
from flask_cors import CORS, cross_origin
import os
from werkzeug.utils import secure_filename


# Pass the parameter "pretrained" as "True" to use the pretrained weights:
model = models.resnet18(pretrained=True)
# switch to model to `eval` mode:
model.eval()

# Define a flask app
app=Flask(__name__)
CORS(app)

# define the function to pre-process the 
def transform_image(image_bytes):
    my_transforms = transforms.Compose([transforms.Resize(255),
                                        transforms.CenterCrop(224),
                                        transforms.ToTensor(),
                                        transforms.Normalize(
                                            [0.485, 0.456, 0.406],
                                            [0.229, 0.224, 0.225])])
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    return my_transforms(image).unsqueeze(0)



# load the mapping provided by the pytorch 
imagenet_class_mapping = json.load(open('imagenet_class_index.json'))


'''
@app.route("/members")
def members():
    return{"members": ["Member1", "Menber2", "Member3"]}
'''

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    f = request.files['myFile']
    basepath = os.path.dirname(__file__)
    file_path = os.path.join(basepath, 'uploads', secure_filename(f.filename))
    f.save(file_path)
    print(file_path)
    result = predict(file_path)
    return result
    #return 'file uploaded successfully!'

# define the function to get the class predicted of image
# it takes the parameter: image path and provide the output as the predicted class
#@cross_origin(supports_credentials=True)

@app.route('/uploadd', methods=['GET', 'POST'])
def uploadd():
    file = request.files['myFile']
    basepath = os.path.dirname(__file__)
    file_path = os.path.join(basepath, 'uploads', secure_filename("imagefile.png"))
    img = Image.open(file.stream)
    img.save(file_path)
    print(file_path)
    result = predict(file_path)
    return result
    #return 'file uploaded successfully!'

@app.route('/predict', methods=['GET', 'POST'])
def predict(image_path):
  # read the image in binary form
    with open(image_path, 'rb') as file:
        image_bytes = file.read()
    # transform the image    
    transformed_image = transform_image(image_bytes=image_bytes)
    # use the model to predict the class
    outputs = model.forward(transformed_image)
    _, category = outputs.max(1)
    # return the value
    predicted_idx = str(category.item())
    finalClass = {"class": imagenet_class_mapping[predicted_idx][1]}
    return finalClass



#print(predict(image_path='C:/Users/an672/Downloads/husky.jpg'))
if __name__ == '__main__':
    app.run(debug=True)
