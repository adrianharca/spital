from nltk.corpus import wordnet
import sys
import json
import itertools
import numpy as np


def readIn():
    ws = []
    lines = sys.stdin.readlines()
    for line in lines:
        ws.append(json.loads(line))
        #   ws.append(line.strip())
    return ws


# print(readIn())

# need to cover word not found and synset selection
def wp(w1, w2):
    syn1 = wordnet.synsets(w1)[0]
    syn2 = wordnet.synsets(w2)[0]
    wps = syn1.wup_similarity(syn2)
    # print(syn1.name(), " - ", syn2.name(), " = ", wps)

    return wps


def fetch_syns_in_set(keyset):
    # synsets = np.array([l._lemma_names
    #                     for l in wordnet.synsets(k)] for k in keyset)
    synsets = {k: wordnet.synsets(k) for k in keyset}
    print(synsets, sep='\\n')
    # bestsets = [k, s for k in keyset, s in synsets if synsets['k'] min([wp(k, kk) for kk in synsets])]
    bestsets = []
    for j in keyset:
        sets = synsets[j]
        bestset = sets[0]
        maxwp = 0
        for s in sets:  # each own synset
            for k in synsets:  # each other word
                if k != j:
                    for s2 in synsets[k]:  # each synset of each other word
                        wps = s.wup_similarity(s2)
                        if (wps and (wps > maxwp)):  # get max(wp(s1,s2))
                            maxwp = wps
                            bestset = s
                            print(bestset, 'is bestset for ',
                                  j, ' wit similarity ', wps, ' against ', s2)
        bestsets.append({j: bestset})

    print(bestsets)


fetch_syns_in_set(['tennis', 'sport', 'outdoor', 'music'])
# construct term matrix


def term_matrix(set1, set2):
    size = max([len(set1), len(set2)])
    # r = [[0 for x in range(len(set1))], [0 for x in range(len(set2))]]
    print(' termmat size ', size)
    r = [[0 for x in range(size)] for x in range(size)]

    print(r)
    sum = 0
    print('      ', set1)
    for i, x in enumerate(set1):
        if len(set2) >= i:
            print(set2[i], end=' ')
        for j, y in enumerate(set2):
            r[i][j] = wp(x, y)
            sum += r[i][j]
            print(round(r[i][j], 3), end='      ')
        print()
    print("avg similarity= ", sum/(len(set1)*len(set2)))
    # print(r)
    return r


def simpson_similarity(r, x, y):
    sum_X = 0
    sum_Y = 0

    for i, _ in enumerate(x):
        # line max
        max_i = 0
        for j, _ in enumerate(y):
            if r[i][j] > max_i:
                max_i = r[i][j]
                # random weird max_i = r[i, j] > max_i
        sum_X += max_i

    for j, _ in enumerate(y):
        # column max
        max_j = 0
        for i, _ in enumerate(x):
            if r[i][j] > max_j:
                max_j = r[i][j]
        sum_Y += max_j
    overallSim = (sum_X + sum_Y) / (2 * (len(x) + len(y)))
    # print("max_i= ", max_i, " sum = ", sum_X)
    # print("max_j= ", max_j, " sum = ", sum_Y)
    print('wp set= ', overallSim)
    return overallSim


def test_fct():
    s1 = ["sport", "picnic"]
    s2 = ["sport", "music"]
    s3 = ["dance", "massage", "math"]
    matterm = term_matrix(s1, s2)
    print(simpson_similarity(matterm, s1, s2))
    matterm1 = term_matrix(s1, s3)
    print(simpson_similarity(matterm1, s1, s3))


# sets = readIn()
# print(sets)
# res = [[0 for x in range(len(sets))] for x in range(len(sets))]
# for i, s in enumerate(sets):
#     setts = set(s)
#     for j, ss in enumerate(sets):
#         setss = set(ss)
#         if(setts != setss):
#             res[i][j] = simpson_similarity(term_matrix(s, ss), s, ss)
# print(res)
