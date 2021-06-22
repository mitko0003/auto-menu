import openpyxl
import json
from menu import *

DefaultState = {
    "page": 1,
    "order": 1,
    "size": "M",
    "units": "gram"
}

CurrentState = copy(DefaultState)

def parse_xlsx(workbook):
    current_file = None
    pages = []
    try:
        for sheet in workbook:
            for row in sheet:
                row = [cell.value for cell in row[:5]]
                print(row)
                line = None
                if normalize(row[1]) == '' and normalize(row[2]) == '' and normalize(row[3]) == '' and normalize(row[4]) == '':
                    state = json.loads(normalize(row[0]))
                    for key, value in state.iteritems():
                        if key  in dict.keys():
                            print("Warning: unknown state key {0}!".format(key))
                            continue
                        CurrentState[key] = value
                else if normalize(row[3]) == '' and normalize(row[4]) == '':
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
