from pandas import read_csv
from pandas import datetime
from pandas import DataFrame
from matplotlib import pyplot
from pandas.plotting import autocorrelation_plot
from statsmodels.tsa.arima_model import ARIMA
from sklearn.metrics import mean_squared_error
import warnings

warnings.filterwarnings("ignore")

for n in range(25):
    filepos = "data/export (" + str(n+1) + ").csv"
    table = read_csv(filepos, header = 0, index_col = 0)
    
    data_table = table.values[7]
    beras_table = table.values[29]
    
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
    
    def parser(x):
        return datetime.strptime(x,'%d/%m/%Y')
    
    prediction_table = read_csv(dummypos, header = 0, parse_dates=[0], index_col=0, squeeze = True, date_parser = parser)
    
    #prediction_table.plot()
    #pyplot.show()
    
    X = prediction_table.values
    size = int(len(X) * 0.9)
    train, test = X[0:size], X[size:len(X)]
    history = [x for x in train]
    predictions = list()
    for t in range(len(test)):
    	model = ARIMA(history, order=(5,1,1))
    	model_fit = model.fit(disp=0)
    	output = model_fit.forecast()
    	yhat = output[0]
    	predictions.append(yhat)
    	obs = test[t]
    	history.append(obs)
    	#print('predicted=%f, expected=%f' % (yhat, obs))
    error = mean_squared_error(test, predictions)
    #print('Test MSE: %.3f' % error)
    pyplot.plot(test)
    pyplot.plot(predictions, color='red')
    pyplot.show()