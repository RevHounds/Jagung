import warnings
from pandas import read_csv
from pandas import datetime
from pandas import DataFrame
from matplotlib import pyplot
from pandas.plotting import autocorrelation_plot
from statsmodels.tsa.arima_model import ARIMA
from sklearn.metrics import mean_squared_error

def evaluate_arima_model(X, arima_order):
    size = int(len(X) * 0.66)
    train, test = X[0:size], X[size:len(X)]
    history = [x for x in train]
    predictions = list()
    for t in range(len(test)):
    	model = ARIMA(history, order=arima_order)
    	model_fit = model.fit(disp=0)
    	yhat = model_fit.forecast()[0]
    	predictions.append(yhat)
    	obs = test[t]
    	history.append(obs)
    	#print('predicted=%f, expected=%f' % (yhat, obs))
    error = mean_squared_error(test, predictions)
    return error

def evaluate_combination(dataset, p_values, d_values, q_values):
    dataset = dataset.astype('float32')
    best_score, best_cfg = float("inf"), None
    for p in p_values:
        for d in d_values:
            for q in q_values:
                order = (p, d, q)
                try:
                    mse = evaluate_arima_model(dataset, order)
                    if mse < best_score:
                        best_score, best_cfg = mse, order
                    print('ARIMA%s MSE = %.3f', (order, mse))
                except:
                    continue
    print('Best ARIMA%s MES = %.3f', (best_cfg, best_score))
    return best_cfg
            
def parser(x):
    return datetime.strptime(x,'%d/%m/%Y')


result = list()

for n in range(33):
    filepos = "data/export (" + str(n+13) + ").csv"
    
    table = read_csv(filepos, header = 7, index_col = 0)
    
    data_table = table.values[0]
    commodity_table = table.values[23]
    
    data_table[0] = "time"
    dummypos = "dummy(" + str(n) + ").csv"
    file = open(dummypos, "w")
    for i in range(len(data_table)):
        if commodity_table[i] == '-':
            if i == 0 or commodity_table[i-1] == 0:
                commodity_table[i] = 0
            else :
                commodity_table[i] = commodity_table[i-1]
        if(i>0):
            line = data_table[i] + "," + commodity_table[i] + '.0' + "\n"
        else: 
            line = data_table[i] + "," + commodity_table[i] + "\n"
        lines = str(line)
        file.write(lines)
    file.close()
    
    
    prediction_table = read_csv(dummypos, header = 0, parse_dates=[0], index_col=0, squeeze = True, date_parser = parser)
    
    prediction_table.plot()
    pyplot.show()
    
    autocorrelation_plot(prediction_table)
    pyplot.show()
    
    p_values = [0,1,2,4,6,8,10]
    d_values = range(0,3)
    q_values = range(0,3)
    warnings.filterwarnings("ignore")
    result.append(evaluate_combination(prediction_table, p_values, d_values, q_values))