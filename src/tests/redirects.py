# © 2024 Laserfiche.
# See LICENSE-DOCUMENTATION and LICENSE-CODE in the project root for license information.
import requests


def getLinks(path):
    links = []
    with open(path, "r") as f:
        lines = f.readlines()
        links = [url[:-1] for url in lines]
    return links

def findBrokenLinks(links):
    broken_links = {}

    for url in links:
        r = requests.get(url)
        if (r.status_code != 200):
            broken_links[url] = r.status_code
    
    return broken_links

def fmtBrokenLinks(broken_links):
    map_list = [ url + " -> " + str(broken[url]) for url in broken_links.keys()]
    return "\n".join(map_list)

fname = "./src/tests/redirected-links.txt"
links = getLinks(fname)
broken = findBrokenLinks(links)

if len(broken):
    link_info = fmtBrokenLinks(broken)
    raise Exception(f"{len(broken)} link(s) returned a non-200 response:\n" + link_info)
else:
    print("Test Passed")