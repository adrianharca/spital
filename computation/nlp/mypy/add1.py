import sys
import json
import numpy as np
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from sklearn import utils

from sklearn import metrics


def use_event_model():
    # already called
    #  model.init_sims(replace=True)
    # if need true vector/ continue training, retrain
    model_d2v = Doc2Vec.load('mypy/corpus/d2vModelFb2.bin')
    return model_d2v


def avgdist(col): return np.mean(col)


def flatten(l): return [item for sublist in l for item in sublist]


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
    dids = []
    if bulk == True:
        dids = [dict({'id': a}) for a in flatten(data[1])]
    else:
        dids = [dict({'id': a}) for a in data[1]]
    # print(json.dumps(flatten(data[1])[:20]))
    dts = list(zip(dw, dids))
    print(json.dumps({'wsLen': len(dw)}))
    print(json.dumps({'idLen': len(dids)}))
    dt = [dict({**a, **b}) for a, b in dts]
    # print(json.dumps({'combinedLen': len(dt)}))
    print(json.dumps(dt[0]))

    train_documents = []
    train_documents.extend([TaggedDocument(
        d['words'], d['id'][0])for d in dt])
    # print(json.dumps(train_documents[:50]))
    return train_documents

# docs is a list of TaggedDocument


def vector_for_learning(model, input_docs):
    sents = input_docs
    # TODO: deal with new words
    model.build_vocab(input_docs, update=True)
    targets, feature_vectors = zip(
        *[(str(did), model.infer_vector(dw, steps=20)) for dw, did in sents])
    return targets, feature_vectors


def sorted_by_3rd(data): return sorted(data, key=lambda tup: tup[2])


def connectOne(keyset):
    model = use_event_model()
    # print(tuple(zip(
    # model.docvecs.index2entity[:20], model.docvecs.vectors_docs[:20])))
    # print('model ids:', model.docvecs.index2entity)
    ids = []
    tids, tvecs = zip(
        * [(a, b) for a, b in zip(model.docvecs.index2entity,  model.docvecs.vectors_docs)])
    #  = zip(*modelmap)
    ids = list(tids)
    vecs = list(tvecs)
    nnewid, nnewvec = vector_for_learning(model, keyset)
    newid = list(nnewid)
    newvec = list(nnewvec)
    # print(newid[0], 'newvec-', newvec[:10])
    # read+ append new vector to untrained vectors file, to be appended to the model for retraining
    # TODO:make dis call create file if non ext
    with open(".\\mypy\\corpus\\results\\untrained.txt", "r+") as f:
        #     tw = [json.loads(line) for line in f.readlines()]
        lines = [json.loads(line) for line in f]  # .readlines()
        untrainedVecs = lines[0] if len(lines) > 0 else []
        untrainedVecs.extend([dict({str(i): v.tolist()})
                              for i, v in zip(newid, newvec)])

        # print('untrained vecs ids b like', [k for d in map(dict, untrainedVecs)
        #                                     for k in d])
        # because it  doesnt work to store many dicts separately only a list of dicts
        f.seek(0)
        f.writelines(json.dumps(untrainedVecs))

    if len(untrainedVecs) > 0:
        ids.extend([k for d in map(dict, untrainedVecs)
                    for k in d])  # map(eval, untrainedVecs)
        vecs.extend([d[k] for d in map(dict, untrainedVecs)
                     for k in d])  # eval bcoz dict cant
        # print(zip(ids[len(ids)-10:], vecs[len(vecs)-10:]))

    distmat_euclid = metrics.pairwise_distances(
        list(newvec), Y=vecs, n_jobs=2)
    print(json.dumps({' distances calculated': len(flatten(distmat_euclid))}))
    avg = avgdist(distmat_euclid)
    out = []
    result = []
    for i, _ in enumerate(distmat_euclid):
        for j, _ in enumerate(distmat_euclid[i]):
            if distmat_euclid[i][j] < avg and newid[i] != ids[j]:
                out.append((newid[i], '-------', ids[j],
                            '  = ', distmat_euclid[i][j]))
                result.append(
                    (str(newid[i]), str(ids[j]), distmat_euclid[i][j]))
        print(json.dumps({'id': newid[i], 'avg dist ': avg}))
        avg = avgdist(distmat_euclid[i])
    ress = sorted_by_3rd(result)[:30]
    print(json.dumps({'result': json.dumps(ress)}, ensure_ascii=False))

    # print(out, sep='\\n')


# def printedges(ids, dists):
#     edges = flatten([[(str(ids[i]), str(ids[j]), dists[i][j])
#                       for i in range(len(o.ids))
#                       if i < j
#                       if o.data[i][j] < avgdist(o.data[i])]
#                      for j in range(len(o.ids))])
#     print(json.dumps({'edgecount': len(edges)}))

#     # todo: correct euclid with wmd
#     print(json.dumps({'result': json.dumps(edges)}, ensure_ascii=False))


def main_add_one():
    keyset = to_tagged_docs(read_obj())
    kst = [[["circ", "cafea", "clovni", "covid", "copii", "elefant"]], [['ama']]]
    kkst = [[['tennis', 'park', 'ball'], ['broomstick', 'sweets', 'kitchen'], [
        'broomstick', 'sweets', 'kitchen'], ['picnic', 'orgy'], ['pulmonary', 'disease', 'factory'], [
        'tobacco', 'chewing', 'association']], [['aba'], ['abb'], ['abc'], ['abd'], ['abe'], ['abf']]]
    # keyset = to_tagged_docs(kkst)

    print(json.dumps(keyset))
    connectOne(keyset)


main_add_one()
