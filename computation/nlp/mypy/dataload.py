import sys
from random_word import RandomWords
import random
import json

r = RandomWords()
# Return a single random word

categories = ['sport', 'activism', 'music', 'literature', 'art']
testdata = [['tennis', 'park', 'ball'], ['broomstick', 'sweets', 'kitchen'], [
    'broomstick', 'sweets', 'kitchen'], ['picnic', 'orgy'], ['pulmonary', 'disease', 'factory'], [
    'tobacco', 'chewing', 'association']]
lol = [['Sci-Fi', 'Vocational Education-Crafts', 'Carousels', 'Surfing', 'Halloween candy sweets', 'Rabies', 'Memorial Day', 'Gypsies'], ['Entrepreneurship', 'Ancient History'], ['Organ donation', 'Bull fighting and matadors'], ['Forensic Anthropology', 'Psychology', "Mother's Day", 'PTSD', 'March Madness basketball', 'Cars', 'Auto Racing'], ['Food banks', 'Hanukkah', 'Tennessee Academic Vocabulary - 7th Grade Math', 'Mammoths and Extinction', 'Vocational and Technical Education', 'Herbs', "Father's Day", 'Hot Air Balloons', 'Technology Terms'], ['Cycling', 'Statesmen, stateswomen', 'Chess', 'Camping', 'Off-road vehicles', 'Black History', 'Fracking', 'Words from German'], ['Tuberculosis', 'Weddings and Marriage', 'Holocaust', 'Tennessee Academic Vocabulary - 7th Grade Language Arts', 'Cowboys', 'Robotics'], ['Job Skills', 'Slavery', 'Terrorism', 'Laundry', 'Moose', 'Birds',
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     'Cancer', 'Law Enforcement', 'Bird names'], ['Color & Communication', 'Harmonica', 'Fabrics', 'ADHD'], ['Sports - Types', 'Tennessee Academic Vocabulary - 7th Grade Social Studies', 'Cats', 'Wolves', 'Mountain Climbing, Caving, Spelunking'], ['Gym and Exercise', 'Watches', 'Eagles', 'Comedy', 'Pope selection', 'Fine Arts'], ['Pasta', 'Poker', 'Hawks, Birds and Raptors', 'Civil War', 'March Madness & Basketball', 'Fears', 'Aging', 'Maine', 'Mistletoe'], ['Iditarod Trail Sled Dog Race', 'Conservation', 'Golden Globe Awards', 'Butterflies', 'Depression', 'Career, Technology Education, Life Skills', 'Heart Songs'], ['Lace', 'Oscars, Film, Arts', 'GED test', 'Flag Day', 'Psychology', 'Civics, Government'], ['German words into English', 'Italian Word List', 'Grammar and grammatical terms', 'Winter Olympic Sports', 'Sexting', 'Large Words, Synonyms', 'Horses and Ranches']]
test1 = [['sport', 'art', 'sober'], ['dance', 'music', 'outdoor'],
         ['mathematics', 'children', 'camp']]
test2 = [['sport', 'art', 'sober'], ['dance', 'music', 'outdoor'],
         ['mathematics', 'children', 'camp']]
wordlist = open("./mypy/corpus/words.txt", "r")
linz = wordlist.readlines()
wl = list(map(lambda x: x.strip(), linz))
wordlist.close()
random.shuffle(wl)
# print(wl)


def readIn():
    ws = []
    lines = sys.stdin.readlines()
    for line in lines:
        ws.append(json.loads(line))
        #   ws.append(line.strip())
    return ws


def wordgen(nr, words: None):
    if(words == None):
        ws = r.get_random_words(hasDictionaryDef="true", includePartOfSpeech="noun",
                                minCorpusCount=1, maxCorpusCount=10, limit=500)
    else:
        ws = words
    listoflists = []
    k = 0
    for _ in range(0, nr):
        # sublist = []
        j = random.randrange(2, 5)
        # for j in range(2, 10):
        sublist = ws[k:k+j]
        k = (k+j) % len(ws)
        listoflists.append(set(sublist))
        # if k+10 >= len(ws):
        #     ws.extend(ws)
        # ws.extend(r.get_random_words(hasDictionaryDef="true", includePartOfSpeech="noun",
        #                              minCorpusCount=1, maxCorpusCount=10, limit=500))
    # for xs in listoflists:
        # print(json.dumps(" ".join(map(str, xs))))
    # lol = {'lol': listoflists}
    # print(json.dumps(lol))
    return listoflists


activitylist = open(".\mypy\corpus\wordlist_activities.txt", "r", "utf-8")
l = activitylist.readlines()
al = list(map(lambda x: x.strip(), l))
random.shuffle(al)
activitylist.close()
loltest = wordgen(10, al)
lol100 = wordgen(100, al)


keyslistfile = open("mypy\corpus\keys.txt", "r")
ks = keyslistfile.readlines()
keylist = [[x for x in sent.strip(
    ' "[]+*\n').split('+') if x.strip(' []"\n+*')] for sent in ks]
# print(keylist)
keyslistfile.close()
