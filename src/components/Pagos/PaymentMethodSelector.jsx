import { FaCreditCard, FaMoneyBillWave, FaMobileAlt } from 'react-icons/fa';

const iconComponents = {
    FaCreditCard,
    FaMoneyBillWave,
    FaMobileAlt,
};

const getIconComponent = (iconName) => {
    return iconComponents[iconName] || FaCreditCard;
};

const PaymentMethodSelector = ({ paymentMethods, selectedMethodId, onMethodSelect }) => {
    return (
        <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Método de Pago <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {paymentMethods.map((method) => {
                    const IconComponent = getIconComponent(method.icon);
                    const isSelected = parseInt(selectedMethodId) === method.id;
                    return (
                        <div
                            key={method.id}
                            className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 
                ${isSelected ? 'border-fuchsia-500 bg-fuchsia-50 shadow-lg' : 'border-gray-300 bg-white hover:border-gray-400'}`}
                            onClick={() => onMethodSelect(method.id.toString())}
                        >
                            <IconComponent className={`text-xl mr-3 ${isSelected ? 'text-fuchsia-900' : 'text-gray-500'}`} />
                            <span className={`text-sm font-medium ${isSelected ? 'text-fuchsia-800' : 'text-gray-700'}`}>{method.name}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PaymentMethodSelector;