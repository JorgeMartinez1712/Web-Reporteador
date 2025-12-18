import CustomerMainDetails from './CustomerMainDetails';
import CustomerAppUserDetails from './CustomerAppUserDetails';
import CustomerLevelDetails from './CustomerLevelDetails';


const CustomerDetailForm = ({
  customer,
  formData,
  handleChange,
  customerTypes,
  documentTypes,
  customerStatuses,
  fetchScoring,
  isEditing,
  passwordValidations,
  passwordTouched,
}) => {
 
  const showAppUser = customer && customer.app_user;
  const showLevel = customer && customer.levels && customer.levels.length > 0;

  return (
    <form className="max-w-full mx-auto space-y-6">
      <div className="w-full rounded-xl shadow-sm bg-white">
        <div className="px-6 pt-5 pb-3">
          <h3 className="flex items-center gap-2 text-emerald-600 text-lg font-medium">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <i className="bi bi-person-lines-fill" />
            </span>
            <span>Datos del Cliente</span>
          </h3>
        </div>
        <div className="px-6 py-5">
          <CustomerMainDetails
            customer={customer}
            formData={formData}
            handleChange={handleChange}
            customerTypes={customerTypes}
            documentTypes={documentTypes}
            customerStatuses={customerStatuses}
            isEditing={isEditing}
            passwordValidations={passwordValidations}
            passwordTouched={passwordTouched}
          />
        </div>
      </div>

      {(showAppUser || showLevel) && (
        <div className="pt-2 space-y-6">
          {showAppUser && (
            <CustomerAppUserDetails customer={customer} />
          )}

          {showLevel && (
            <CustomerLevelDetails customer={customer} fetchScoring={fetchScoring} />
          )}
        </div>
      )}
    </form>
  );
};

export default CustomerDetailForm;