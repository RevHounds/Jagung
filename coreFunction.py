from pandas import read_csv
from pandas import datetime
from pandas import DataFrame
from matplotlib import pyplot
from pandas.plotting import autocorrelation_plot
from statsmodels.tsa.arima_model import ARIMA
from sklearn.metrics import mean_squared_error
import warnings

warnings.filterwarnings("ignore")

def parser(x):
    return datetime.strptime(x,'%d/%m/%Y')

for n in range(25):
    filepos = "data/export (" + str(n+1) + ").csv"
    table = read_csv(filepos, header = 0, index_col = 0)
    
    data_table = table.values[7]
    beras_table = table.values[29]
    provinceName = table.values[2][1]
    data_table[0] = "time"
    
    dummypos = "dump/dummy(" + str(n+1) + ").csv"
    file = open(dummypos, "w")
    
    for i in range(len(data_table)):
        if beras_table[i] == '0' or beras_table[i]=='-':
            beras_table[i] = beras_table[i-1]
        if(i>0):
            line = data_table[i] + "," + beras_table[i] + '.0' + "\n"
        else: 
            line = data_table[i] + "," + beras_table[i] + "\n"
        lines = str(line)
        file.write(lines)
    
    file.close()
        
    prediction_table = read_csv(dummypos, header = 0, parse_dates=[0], index_col=0, squeeze = True, date_parser = parser)
    
    X = prediction_table.values
    train = X[0:len(X)-2]
    test = X[len(X)-1]
    history = [x for x in train]
    predictions = list()
    model = ARIMA(history, order=(1,0,0))
    model_fit = model.fit(disp=0)
    output = model_fit.forecast()
    yhat = output[0]
    predictions.append(yhat)
    obs = test
    history.append(obs)
    print('province %s \npredicted=%f, expected=%f' % (provinceName, yhat, obs))