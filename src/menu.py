import enum
import re

TYPE_INDEX = 0
ROW = 'R'
TITLE = 'T'

ROW_TYPES = [ROW, TITLE]

NAMES_OFFSET = 1

LANGUAGES = []

def normalize(value):
    return '' if value is None else re.sub("[\ufeff]", '', value.strip())

class Language:
    def __init__(self, txt_index, excel_index):
        self.txt_index = txt_index + NAMES_OFFSET
        self.excel_index = excel_index
        LANGUAGES.append(self)

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
