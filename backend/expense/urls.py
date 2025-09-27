from django.urls import path
from .views import (
    signup, login, add_expense, manage_expense,
    update_expense, delete_expense, search_expense,
    change_password     
)

urlpatterns = [
    path('signup/', signup, name="signup"),
    path('login/', login, name="login"),
    path('add-expense/', add_expense, name="add-expense"),
    path('manage-expense/<int:user_id>/', manage_expense, name="manage-expense"),
    path('update-expense/<int:expense_id>/', update_expense, name="update-expense"),
    path('delete-expense/<int:expense_id>/', delete_expense, name="delete-expense"),
    path('search-expense/<int:user_id>/', search_expense, name="search-expense"),
    path('change-password/<int:user_id>/', change_password, name="change-password"),  
]
