import sys
import json
import numpy as np
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from sklearn import utils
import multiprocessing
from skbio.stats.distance import DissimilarityMatrix
from sklearn import metrics
from matplotlib import pyplot as plt


def flatten(l): return [item for sublist in l for item in sublist]

# Read data from stdin


def read_in():
    lines = sys.stdin.readlines()
    # print("arg vals pre decode:", lines)
    # Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines)


def read_obj():
    lines = sys.stdin.readlines()
    # print("arg vals pre decode:", lines)
    obj = []
    obj = [json.loads(i) for i in lines if i][0]
    # print(json.dumps(obj[0]))
    # for ln in json.loads(lines):
    #     obj.append(ln)
    # print('args post decode', obj)
    return obj


def to_tagged_docs(data, bulk=False):
    # expects list of [[lists of words],[ids]] and converts it to TaggedDocument, if bulk insert from JS is being used call with bulk=True

    dw = [dict({'words': a})for a in data[0]]
    # dids = []
    # if bulk == True:
    dids = [dict({'id': a}) for a in flatten(data[1])]
    # else:
    # dids = [dict({'id': a}) for a in data[1]]
    print(json.dumps({'py ids': json.dumps(dids[:20])}))
    dts = list(zip(dw, dids))
    print(json.dumps({'wsLen': len(dw)}))
    print(json.dumps({'idLen': len(dids)}))
    dt = [dict({**a, **b}) for a, b in dts]
    # print(json.dumps({'combinedLen': len(dt)}))
    # print('py wds:', json.dumps(dt[:5]))

    train_documents = []
    train_documents.extend([TaggedDocument(
        d['words'], d['id']) for d in dt])
    # print(json.dumps({'traindox': json.dumps(train_documents[:3])}))
    return train_documents

# docs is a list of TaggedDocument


def vector_for_learning(model, input_docs):
    sents = input_docs
    targets, feature_vectors = zip(
        *[(str(did), model.infer_vector(dw, steps=20)) for dw, did in sents])
    return targets, feature_vectors


def use_event_model():
    # already called
    #  model.init_sims(replace=True)
    # if need true vector/ continue training, retrain
    model_d2v = Doc2Vec.load('mypy/corpus/d2vModelFb2.bin')
    return model_d2v


def vector_for_ev_learning(model, input_docs):
    sents = input_docs
    targets, feature_vectors = zip(
        *[(str(doc.words), model.infer_vector(doc.words, steps=20)) for doc in sents])
    return targets, feature_vectors


def train_model(docs):
    cores = multiprocessing.cpu_count()
    model_d2v = Doc2Vec(dm=1, vector_size=300, negative=5, hs=0,
                        min_count=2, sample=0, workers=cores, alpha=0.025, min_alpha=0.001)  # vector_size=(len(train_documents)-1) for tiny datasets,
    # alldocs = list(itertools.chain(train_documents, test_docs))
    model_d2v.build_vocab(docs)
    train_documents = utils.shuffle(docs)
    model_d2v.train(train_documents, total_examples=len(
        train_documents), epochs=30)
    # model_d2v.init_sims() if u wanna wmd but careful
    # model_d2v.save_word2vec_format(
    #     'mypy/corpus/d2vModelFb2w2vform.txt', word_vec=True, doctag_vec=True)
    with open('.\\mypy\\corpus\\d2vModelFb2.bin', 'wb+') as pfil:
        model_d2v.save(pfil)
    print(json.dumps({'model ids:': json.dumps(
        model_d2v.docvecs.index2entity)}))

    return model_d2v


# def use_saved_model():
#     model_d2v = Doc2Vec.load('mypy/corpus/d2vtweetmodel.bin')
#     return model_d2v


def dist(model, p1, p2): return model.wv.wmdistance(p1, p2)


untrainedVecs = []


def plotDissimiliarity(mat):
    fig, ax = plt.subplots()
    fig = mat.plot(cmap='Reds', title='Euclid heatmap')
    # ax = outdmwm.plot(cmap='Reds', title='Word movers heatmap')
    plt.show()


def avgdist(col): return np.mean(col)


def main():
    lines = read_obj()
    docs = to_tagged_docs(lines, bulk=True)
    print(json.dumps(docs[0]))
    model = train_model(docs)
    # model = use_event_model()
    ids, vecs = vector_for_learning(model, docs)
    distmat_euclid = metrics.pairwise_distances(
        [x for x in vecs], n_jobs=2)

    o = DissimilarityMatrix(
        distmat_euclid, ([x.tags[0] for x in docs]))  # tuple(x.tags)
    # print(json.dumps({'avgdist': avgdist}))
    # o.png()  # tuple(x.tags)
    # plotDissimiliarity(o)
    edges = flatten([[(str(o._ids[i]), str(o._ids[j]), o.data[i][j])
                      for i in range(len(o.ids))
                      if i < j
                      if o.data[i][j] < avgdist(o.data[i])]
                     for j in range(len(o.ids))])
    print(json.dumps({'edgecount': len(edges)}))

    # todo: correct euclid with wmd
    print(json.dumps({'result': json.dumps(edges)}, ensure_ascii=False))
    # # dm = np.asarray([[dist(model, p1.words, p2.words) for p2 in docs]
    # #                  for p1 in docs])
    # # print(dm)


# optional future: return a series of edges from this to the centroids of the dataset.


# def main():
#     tw = []
#     with open(".\\mypy\corpus\\results\matrix.txt", "r") as f:
#         tw = [json.loads(line) for line in f.readlines()]
# # print(tw[0, 0])
#     train_documents = []
#     train_documents.extend([TaggedDocument(
#         sentence, str(k))for k, sentence in enumerate(tw[0])])
#     model = use_event_model()
#     y_train, X_train = vector_for_ev_learning(model, train_documents)
#     distmat_euclid = metrics.pairwise_distances(
#         [x for x in X_train], n_jobs=2)
#     o = DissimilarityMatrix(
#         distmat_euclid, ([y for y in y_train]))
#     # distmat_euclid, ([x.tags for x in train_documents]))
#     edges = flatten([[(str(o._ids[i]), str(o._ids[j]), o.data[i][j])
#                       for i in range(len(o.ids)) if i < j] for j in range(len(o.ids))])
#     print(json.dumps(dict({'result': edges})))
#     # dm = np.asarray([[dist(model, p1.words, p2.words) for p2 in docs]
#     #                  for p1 in docs])
# start process
if __name__ == '__main__':
    main()

# def connectOne(keyset):
#     model = use_event_model()
#     # print(tuple(zip(
#     #     model.docvecs.index2entity[:20], model.docvecs.vectors_docs[:20])))
#     ids = []
#     tids, tvecs = zip(
#         * [(a, b) for a, b in zip(model.docvecs.index2entity,  model.docvecs.vectors_docs)])
#     #  = zip(*modelmap)
#     ids = list(tids)
#     vecs = list(tvecs)
#     newid, newvec = vector_for_learning(model, keyset)
#     print(newid, 'newvec-', newvec[:10])
#     # read+ append new vector to untrained vectors file, to be appended to the model for retraining
#     # TODO:make dis call create file if non ext
#     with open(".\\mypy\\corpus\\results\\untrained.txt", "r+") as f:
#         #     tw = [json.loads(line) for line in f.readlines()]
#         untrainedVecs = [json.load(line) for line in f.readlines()]
#         f.writelines([json.dumps({i: json.dumps(v.tolist())})
#                       for i, v in zip(newid, newvec)])

#     if len(untrainedVecs) > 0:
#         ids.extend([k for d in untrainedVecs for k in d])
#         vecs.extend([d[k] for d in untrainedVecs for k in d])
#         print(zip(ids[len(ids)-10:], vecs[len(vecs)-10:]))

#     distmat_euclid = metrics.pairwise_distances(
#         list(newvec), vecs, n_jobs=2)
#     print(len(distmat_euclid), ' distances calculated')
#     avg = avgdist(flatten(distmat_euclid))
#     out = []
#     for i, _ in enumerate(distmat_euclid):
#         for j, _ in enumerate(distmat_euclid[i]):
#             if distmat_euclid[i][j] < avg:
#                 out.append((ids[i], '-------', ids[j],
#                             '  = ', distmat_euclid[i][j]))
#     print(out)


# def main_add_one():
#     keyset = to_tagged_docs(
#         [[["circ", "cafea", "clovni", "covid", "copii", "elefant"]], ['aaa']])
#     print(keyset)
#     connectOne(keyset)
