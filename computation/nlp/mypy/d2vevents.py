import warnings
import logging
import numpy as np
from mpl_toolkits.mplot3d import Axes3D
from matplotlib import pyplot as plt
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from sklearn import utils
from mst_clustering import MSTClustering
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
import multiprocessing
import codecs
from nltk.corpus import stopwords
import csv
from nltk import word_tokenize
import json
stop_words = stopwords.words('romanian')
stop_words.extend(stopwords.words('english'))

# def preprocess(tokens):
#     # remove all tokens that are not alphabetic

#     return words
#     # print(stop_words)


def flatten(l): return [item for sublist in l for item in sublist]


def read_fb_set():
    tweet = []
    with open(".\mypy\corpus\\fb_events10.csv", "r", encoding="utf-8") as file:
        reader = csv.reader(file, delimiter='~')
        txt = str(file.readlines())
        # for row in reader:
        for line in txt.split('~'):
            tokens = word_tokenize(str(line))
            tokens = [w.lower().strip() for w in tokens]
            words = [word for word in tokens if word.isalpha()
                     and not word in stop_words]
            # print(words[:100])
            tweet.append(words)
    #         # print("Tweet : %s" % row)
    #     # res = list(map(preprocess, tweet))
    print(len(tweet))
    return tweet


def train_model(docs):
    cores = multiprocessing.cpu_count()
    model_d2v = Doc2Vec(dm=1, vector_size=len(docs), negative=5, hs=0,
                        min_count=2, sample=0, workers=cores, alpha=0.025, min_alpha=0.001)  # vector_size=(len(train_documents)-1) for tiny datasets,
    model_d2v.build_vocab(docs)
    train_documents = utils.shuffle(docs)
    model_d2v.train(train_documents, total_examples=len(
        train_documents), epochs=30)
    model_d2v.save('mypy/corpus/d2vModelFb.bin')
    return model_d2v


def use_saved_model():
    model_d2v = Doc2Vec.load('mypy/corpus/d2vModelFb.bin')
    return model_d2v


def vector_for_learning(model, input_docs):
    sents = input_docs
    targets, feature_vectors = zip(
        *[(str(doc.words), model.infer_vector(doc.words, steps=20)) for doc in sents])
    return targets, feature_vectors


def dimReduce(vecs, n=3):
    pca = PCA(n_components=50)  # 50
    fiftyDimVecs = pca.fit_transform(vecs)  # X_test
    # print(fiftyDimVecs[0])
    tsne = TSNE(n_components=n)
    twoDimVecs = tsne.fit_transform(fiftyDimVecs)
    return twoDimVecs


def clustrMST(vecs):
    clustrs = MSTClustering(cutoff=0.2, approximate=False, min_cluster_size=2)
    labels = clustrs.fit_predict(vecs)
    return labels


def plot3d(txt, coords, colors):
    # fig, ax = plt.subplots()

    fig = plt.figure()
    ax = fig.gca(projection='3d')
    ax.scatter(coords[:, 0], coords[:, 1],
               coords[:, 2],  c=colors, cmap='plasma')

    for doc, vec3d in zip(txt, coords):  # y_test
        # ax.scatter(vec3d[0], vec3d[1], vec3d[2],  c=col, cmap='rainbow')
        # ax.annotate(doc, (twoDimVec[0], twoDimVec[1]))
        # ax.scatter(vec3d[0], vec3d[1], vec3d[2])
        ax.text(vec3d[0], vec3d[1], vec3d[2], str(doc))
    # Force the figure to be drawn

        logger = logging.getLogger('matplotlib.mathtext')
        logger.setLevel(logging.DEBUG)
        # original_level = logger.getEffectiveLevel()
        # logger.setLevel(logging.ERROR)
        # with warnings.catch_warnings():
        #     warnings.simplefilter('ignore')
        plt.show()
        # logger.setLevel(original_level)


def plotcluster(clstrIndex, vecs, labels):
    l1indices = [i for i, k in enumerate(labels) if k == clstrIndex]
    l1labels = [k for i, k in enumerate(labels) if i in l1indices]
    l1result = [list(k) for i, k in enumerate(
        list(vecs)) if i in l1indices]  # twoDimVecs is result of tsne, result is result of PCA
    l1y = [k for i, k in enumerate(y_train) if i in l1indices]
    # print(tuple(zip(l1labels, l1y, l1result)), sep="\n")
    # print(l1result)
    if len(l1indices) == 0:
        print('empty cluster')
    plot3d(l1y, l1result, l1labels)


# tw = read_fb_set()
tw = []
with open(".\\mypy\corpus\\results\matrix.txt", "r") as f:
    tw = [json.loads(line) for line in f.readlines()]
# print(tw[0, 0])
train_documents = []
train_documents.extend([TaggedDocument(
    sentence, str(k))for k, sentence in enumerate(tw[0])])
model = use_saved_model()
y_train, X_train = vector_for_learning(model, train_documents)
reduced = dimReduce(X_train)
labels = clustrMST(reduced)
plot3d(y_train, reduced, labels)
# print(labels)
# plotcluster(labels[0], reduced, y_train)
# with open('mypy/corpus/results/matrix.txt', mode='w+') as out:
#     out.writelines(json.dumps(tw))
