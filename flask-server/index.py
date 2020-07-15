from flask import Flask, request, jsonify

import json
import re
import string
import pickle
import numpy as np
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize
import tensorflow as tf 
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
import numpy as np
from sklearn.linear_model import LinearRegression

graph = tf.get_default_graph()

session = tf.keras.backend.get_session()
init = tf.compat.v1.global_variables_initializer()
session.run(init)

app = Flask(__name__)

model = load_model('my_model.h5')
ps = PorterStemmer()

file = open('processed_list_of_tweets.pkl', 'rb')
text_data = pickle.load(file)
file.close()

x = (int)(len(text_data) * 0.8)
training_text = text_data[0:x]

tokenizer = Tokenizer(num_words = 5000, oov_token= '<<none>>')
tokenizer.fit_on_texts(training_text)
word_index = tokenizer.word_index

def words_only(text):
    '''Remove puctuations, underscores, numbers, words containing numbers and @_mentions.'''
    text = text.lower()
    text = re.sub(r'\w*\#angry\w*', '', text)
    text = re.sub(r'\w*\#hate\w*', '', text)
    text = re.sub(r'\w*\@\w*', '', text)
    text = re.sub(r'[^\w\s]','', text)
    text = re.sub(r'\_','',text)
    text = re.sub(r'\w*\d\w*', '', text)
    text = re.sub(' +', ' ',text)
    return remove_stop_words(text.strip())

#nltk.download('punkt')

def remove_stop_words(text):
    '''Remove stop words and stem the words'''
    text_filtered = ""
    text = word_tokenize(text)
    for word in text:
        if word not in stopwords.words("english"):
            word = ps.stem(word)
            text_filtered = text_filtered+" "+word
    return text_filtered.strip()

def predict_the_sentiment(text):
    txt2 = words_only(text)
    txt = []
    txt.append(txt2)
    seq = tokenizer.texts_to_sequences(txt)
    padded = pad_sequences(seq, maxlen=50, padding='post', truncating='post')
    with graph.as_default():
        pred = model.predict(padded)
    labels = ['happy', 'sad', 'angry', 'hate', 'neutral'] 
    #print(pred)
    #print(np.argmax(pred))
    return(labels[np.argmax(pred)-1])

    
@app.route('/analysis', methods=['POST'])
def analysis_data():
    if (request.method == 'POST'):
        data = json.loads(request.data)
        data_array = json.loads(data['data'])
        classified_data = []
        with session.as_default():
           with graph.as_default():
                for x in data_array:
                    sentiment = predict_the_sentiment(x['text'])
                    classified_data.append({"time":x['time'],"text":x['text'],"id":x['id'],"sentiment": sentiment})
        return jsonify(classified_data)

if __name__ == '__main__':
    app.run('localhost','7001')
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

