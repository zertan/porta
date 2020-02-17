class DefaultNilFieldEndUsersSwitch < ActiveRecord::Migration[5.0]
  def change
    change_column_null :settings, :end_users_switch, true
  end
end
