from nose.tools import *
import tagrefinery.helper as h

def test_dice_coefficient():
    s1 = ["a","b"]
    s2 = ["a","c"]
    sim = h.StringSimilarity()

    assert_equal(sim.dice_coefficient(s1,s1),1)
    assert_equal(sim.dice_coefficient(s1,[]),0)
    assert_equal(sim.dice_coefficient(s1,s2),0.5)
