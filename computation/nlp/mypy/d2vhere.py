import nltk
import json
import multiprocessing
from nltk.corpus import reuters
from gensim.models import Word2Vec
import gensim.models.keyedvectors as word2vec
from gensim.models import KeyedVectors
from gensim.models import Word2Vec
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
import dataload
import numpy as np
from matplotlib import pyplot as plt
from mst_clustering import MSTClustering
from sklearn.decomposition import PCA
from sklearn import utils
import itertools
from sklearn.linear_model import LogisticRegression
from sklearn.manifold import TSNE
from mpl_toolkits.mplot3d import Axes3D
from sklearn import preprocessing
from sklearn import metrics
from skbio.stats.distance import DissimilarityMatrix

# load data
# nltk.download('reuters')
# nltk.download('punkt')

# flatten a lsit of lists


def flatten(l): return [item for sublist in l for item in sublist]


# filename = './mypy/corpus/GoogleNews-vectors-negative300.bin.gz'
# load vectors
# model = KeyedVectors.load_word2vec_format(filename, binary=True)
# load corpus & train word2vec
# wmodel = Word2Vec(common_texts, size=100, window=5, min_count=1, workers=4)
# word_vectors = wmodel.wv
# avg word vectors for each keyset and find most_similar word
# train doc2vec
cores = multiprocessing.cpu_count()
data = dataload.keylist
testdata = dataload.loltest
# data.extend(dataload.testdata)

train_documents = []
train_documents.extend([TaggedDocument(
    sentence, str(k))for k, sentence in enumerate(data)])

test_docs = []
test_docs.extend([TaggedDocument(
    sentence, str(k))for k, sentence in enumerate(testdata)])
# print(train_documents)

# model_d2v = Doc2Vec(dm=1, vector_size=300, negative=5, hs=0,
#                     min_count=2, sample=0, workers=cores, alpha=0.025, min_alpha=0.001)  # vector_size=(len(train_documents)-1) for tiny datasets,
# alldocs = list(itertools.chain(train_documents, test_docs))
# model_d2v.build_vocab(alldocs)
# train_documents = utils.shuffle(train_documents)
# model_d2v.train(train_documents, total_examples=len(
#     train_documents), epochs=30)
# model_d2v.wv.save_word2vec_format('mypy/corpus/docvecs.txt', binary=False)
# model_d2v.save('mypy/corpus/d2vtweetmodel.bin')

model_d2v = Doc2Vec.load('mypy/corpus/d2vtweetmodel.bin')


def get_wmds(model=model_d2v, nr=5):
    for i in range(0, nr):
        print(' wmd ', train_documents[1], '\n', train_documents[i], '\n',
              model.wv.wmdistance(train_documents[1].words, train_documents[i].words))


def vector_for_learning(model, input_docs):
    sents = input_docs
    targets, feature_vectors = zip(
        *[(str(doc.words), model.infer_vector(doc.words, steps=20)) for doc in sents])
    return targets, feature_vectors


y_train, X_train = vector_for_learning(model_d2v, train_documents)
# print('vector listlength: ', len(list(zip(y_train, [x[0] for x in X_train]))))
y_test, X_test = vector_for_learning(model_d2v, test_docs)
# def classifyLogReg():
# logreg = LogisticRegression()  # n_jobs = 1, C = 1e5
# logreg.fit(X_train, y_train)
# y_pred = logreg.predict(X_test)
# X_scale = preprocessing.scale(X_train)


def dimReduce(n=3):
    pca = PCA(n_components=50)  # 50
    fiftyDimVecs = pca.fit_transform(X_train)  # X_test
    # print(fiftyDimVecs[0])
    tsne = TSNE(n_components=n)
    twoDimVecs = tsne.fit_transform(fiftyDimVecs)
    return twoDimVecs


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
        ax.text(vec3d[0], vec3d[1], vec3d[2], doc)
    plt.show()


# cluster resulting vectors
def clustrMST():
    clustrs = MSTClustering(cutoff=0.2, approximate=False, min_cluster_size=2)
    labels = clustrs.fit_predict(X_train)
    return labels
    # print(set(labels))
    # zip(y_train, labels)
    # clustrs.get_graph_segments
    # print(clustrs.cluster_graph_._shape)
    # pca = PCA(n_components=3)
    # result = pca.fit_transform(fiftyDimVecs)  # clustrs.cluster_graph_)


def plot2d(txt, vects, tags):
    fig, ax = plt.subplots()
    ax.scatter(vects[:, 0], vects[:, 1], c=tags, cmap='viridis')
 # ax.scatter(fiftyDimVecs[:, 0], fiftyDimVecs[:, 1], c=labels, cmap='rainbow')
    for doc, v in zip(txt, vects):
        ax.annotate(doc, (v[0], v[1]))
    plt.show()


def plotcluster(clstrIndex, vecs, labels):
    l1indices = [i for i, k in enumerate(labels) if k == clstrIndex]
    l1labels = [k for i, k in enumerate(labels) if i in l1indices]
    l1result = [list(k) for i, k in enumerate(
        list(vecs)) if i in l1indices]  # twoDimVecs is result of tsne, result is result of PCA
    l1y = [k for i, k in enumerate(y_train) if i in l1indices]
    # print(tuple(zip(l1labels, l1y, l1result)), sep="\n")
    # print(l1result)
    plot3d(l1y, l1result, l1labels)


def testShow(vecs, y_train, labels):
    plotcluster(1, vecs, labels)
    plotvecs = dimReduce(3)
    plot3d(y_train[::20], plotvecs[::20], labels[::20])
    plot2dvecs = dimReduce(2)
    plot2d(y_train[::15], plot2dvecs[::15], labels[::15])


# calc pairwise distances & plot
# get_wmds()
# dis for better word movers
model_d2v.init_sims(replace=True)
# print('post normalization')
# get_wmds()
distmat_euclid = metrics.pairwise_distances(
    [x for x in X_train[::50]], n_jobs=2)


def dist(p1, p2): return model_d2v.wv.wmdistance(p1, p2)


dm = np.asarray([[dist(p1.words, p2.words) for p2 in train_documents[::50]]
                 for p1 in train_documents[::50]])
# print(dm)
outdmeuclid = DissimilarityMatrix(
    distmat_euclid, ([tuple(x.words) for x in train_documents[::50]]))
outdmwm = DissimilarityMatrix(dm, y_train[::50])


def plotDissimiliarity():
    fig, ax = plt.subplots()
    fig = outdmeuclid.plot(cmap='Reds', title='Euclid heatmap')
    ax = outdmwm.plot(cmap='Reds', title='Word movers heatmap')
    plt.show()


# vecs3d = dimReduce()
# labelz = clustrMST()
# plot3d(y_train[::20], vecs3d, labelz)


# plotDissimiliarity()
# out = open('mypy/corpus/results/matrix.txt', mode='w+')
# out.writelines(json.dumps(distmat_euclid.tolist()))
# distmat_wmd = metrics.pairwise_distances([x.words for x in train_documents[::20]], [
#     y.words for y in train_documents[::20]], metric=model_d2v.wv.wmdistance)

# out.write('\n pairwise word movers')
# out.writelines(json.dumps(distmat_wmd.tolist()))
# out.close()
