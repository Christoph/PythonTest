import numpy as np

class StringSimilarity:
    def dice_coefficient(self, set1, set2):
        nom = np.intersect1d(set1,set2).size
        deno = np.unique(set1).size+np.unique(set2).size
    
        return 2*nom/deno 
