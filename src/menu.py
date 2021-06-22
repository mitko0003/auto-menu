import enum
import re

TYPE_INDEX = 0
ROW = 'R'
TITLE = 'T'

ROW_TYPES = [ROW, TITLE]

NAMES_OFFSET = 1

LANGUAGES = []

UNITS = {
    "gram" = "гр/gr",
    "milliliter" = "мл/ml"
}

def normalize(value):
    return '' if value is None else re.sub("[\ufeff]", '', value.strip())

class Language:
    def __init__(self, txt_index, excel_index):
        self.txt_index = txt_index + NAMES_OFFSET
        self.excel_index = excel_index
        LANGUAGES.append(self)

class Row:
    def __init__(self, name, weight, price):
        self.name = name
        self.weight = weight
        self.price = price

class Section:
    def __init__(self, title):
        self.title = title
        self.rows = []
        self.order = 1

class Page:
    def __init__(self):
        self.sections = []
        self.order = 1

BG = Language(0, 0)
EN = Language(1, 1)
GR = Language(2, 2)

def for_all_languages(function):
    for language in LANGUAGES:
        function(language)

class BorderStyle(enum.IntEnum):
    NONE         = 0
    CONTINUOUS_0 = 1
    CONTINUOUS_1 = 2
    DASH         = 3
    DOT          = 4
