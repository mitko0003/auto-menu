import xlsxwriter
from menu import *
import os
import re

# Create an new Excel file and add a worksheet.
workbook = xlsxwriter.Workbook("Menu.xlsx") # TODO: This should be an argument
worksheets = {}
worksheet = None
bold = workbook.add_format({"bold": True, "border": BorderStyle.CONTINUOUS_0})
border = workbook.add_format({"border": BorderStyle.CONTINUOUS_0})

max_lengths = {BG: 0, EN: 0, GR: 0}
files = os.listdir() # TODO: This should be using an argument
row = 0

def calculate_width(lang, info):
    max_lengths[lang] = max(max_lengths[lang], len(info))

for text_file in files:
    print(text_file)
    if text_file[-4:] != ".txt":
        continue
    with open(text_file, 'r') as opened_file:
        current_line = opened_file.readline()
        while current_line:
            print(current_line)
            current_line = current_line.strip()
            current_line = re.sub("[\ufeff]", '', current_line)
            data = current_line.split('#')

            if data[TYPE_INDEX] not in ROW_TYPES:
                current_line = opened_file.readline()
                continue

            if data[TYPE_INDEX] == ROW:
                for_all_languages(lambda lang: calculate_width(lang, data[lang.txt_index]))
                for_all_languages(lambda lang: worksheet.write(row, lang.excel_index, data[lang.txt_index], border))
                worksheet.write(row, 3, data[4], border) # TODO: Use constants
                worksheet.write(row, 4, data[5], border) 
            elif data[TYPE_INDEX] == TITLE:
                if worksheet is not None:
                    for_all_languages(lambda lang: worksheet.set_column(lang.excel_index, lang.excel_index, max_lengths[lang]))
                    for key in max_lengths.keys():
                        max_lengths[key] = 0
                worksheet = worksheets[data[EN.txt_index]] = workbook.add_worksheet(data[EN.txt_index])
                row = 0
                for_all_languages(lambda lang: calculate_width(lang, data[lang.txt_index]))
                for_all_languages(lambda lang: worksheet.write(row, lang.excel_index, data[lang.txt_index], bold))

            row += 1
            current_line = opened_file.readline()

workbook.close()
