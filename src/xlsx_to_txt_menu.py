import openpyxl
from menu import *

def parse_xlsx(workbook):
    current_file = None
    try:
        for sheet in workbook:
            for row in sheet:
                row = [cell.value for cell in row[:5]]
                print(row)
                line = None
                if normalize(row[3]) == '' and normalize(row[4]) == '':
                    if current_file is not None:
                        current_file.close()
                    if normalize(row[1]) != '':
                        current_file = open("{0}.txt".format(normalize(row[1])), 'w')
                        line = "T#{0}#{1}#{2}\n".format(*map(normalize, row[:3]))
                    else:
                        continue
                else:
                    line = "R#{0}#{1}#{2}#{3}#{4}\n".format(*map(normalize, row))
                if current_file is None or line is None:
                    print("Parsing problem (No title)!")
                    return
                print(line)
                current_file.write(line)
    except IOError:
        print("IOError!")
    finally:
        if current_file is not None:
            current_file.close()
    return True

if __name__ == "__main__":
    if parse_xlsx(openpyxl.load_workbook(filename = "Menu.xlsx")):
        print("Finished!")
