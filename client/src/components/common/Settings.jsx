import { useState } from "react";

const Toggle = ({ enabled, onChange, disabled = false }) => {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition
        ${enabled ? "bg-green-500" : "bg-gray-300"}
        ${disabled ? "cursor-not-allowed opacity-70" : ""}
      `}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition
          ${enabled ? "translate-x-5" : "translate-x-1"}
        `}
      />
    </button>
  );
};

const NotificationSettings = () => {
  const [email, setEmail] = useState({
    enabled: true,
    orderUpdates: true,
    promotions: false,
    surveys: true,
  });

  const [sms, setSms] = useState({
    enabled: true,
    promotions: false,
  });

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold">Settings</h1>
      {/* EMAIL */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="font-semibold text-lg">Email Notifications</h2>
            <p className="text-sm text-gray-500">
              Important account notifications and reminders cannot be turned off
            </p>
          </div>
          <Toggle enabled={email.enabled} onChange={() => setEmail({...email, enabled: !email.enabled})} />
        </div>

        <div className="space-y-5">
          <div className="flex justify-between">
            <div>
              <p className="font-medium">Order Updates</p>
              <p className="text-sm text-gray-500">
                Updates on shipping and delivery status of all orders
              </p>
            </div>
            <Toggle
              enabled={email.orderUpdates}
              onChange={() =>
                setEmail({ ...email, orderUpdates: !email.orderUpdates })
              }
            />
          </div>

          <div className="flex justify-between">
            <div>
              <p className="font-medium">Promotions</p>
              <p className="text-sm text-gray-500">
                Exclusive updates on upcoming deals and campaigns
              </p>
            </div>
            <Toggle
              enabled={email.promotions}
              onChange={() =>
                setEmail({ ...email, promotions: !email.promotions })
              }
            />
          </div>

          <div className="flex justify-between">
            <div>
              <p className="font-medium">Customer Surveys</p>
              <p className="text-sm text-gray-500">
                Receive survey to help Shopee serve you better
              </p>
            </div>
            <Toggle
              enabled={email.surveys}
              onChange={() =>
                setEmail({ ...email, surveys: !email.surveys })
              }
            />
          </div>
        </div>
      </div>

      {/* SMS */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="font-semibold text-lg">SMS Notifications</h2>
            <p className="text-sm text-gray-500">
              Important account notifications and reminders cannot be turned off
            </p>
          </div>
          <Toggle enabled={sms.enabled} onChange={() => setSms({...sms, enabled: !sms.enabled})} />
        </div>

        <div className="flex justify-between">
          <div>
            <p className="font-medium">Promotions</p>
            <p className="text-sm text-gray-500">
              Exclusive updates on upcoming deals and campaigns
            </p>
          </div>
          <Toggle
            enabled={sms.promotions}
            onChange={() =>
              setSms({ ...sms, promotions: !sms.promotions })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
