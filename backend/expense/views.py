from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import UserDetail, Expense
from django.db.models import Sum

# ---------------- Signup API ----------------
@csrf_exempt
def signup(request): 
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode("utf-8"))
            fullname = data.get('full_name') 
            email = data.get('email')
            password = data.get('password')

            if not fullname or not email or not password:
                return JsonResponse({'message': 'All fields are required'}, status=400)

            if UserDetail.objects.filter(email=email).exists():
                return JsonResponse({'message': 'Email already exists'}, status=400)

            UserDetail.objects.create(
                full_name=fullname,
                email=email,
                password=password
            )
            return JsonResponse({'message': 'User Registered Successfully'}, status=201)

        except Exception as e:
            return JsonResponse({'message': f'Error: {str(e)}'}, status=500)

    return JsonResponse({'message': 'Invalid request'}, status=400)


# ---------------- Login API ----------------
@csrf_exempt
def login(request): 
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode("utf-8"))
            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                return JsonResponse({'message': 'Both email and password are required'}, status=400)

            try:
                user = UserDetail.objects.get(email=email, password=password)  
                return JsonResponse({
                    'message': 'Login Successful',
                    'userId': user.id,
                    'userName': user.full_name
                }, status=200)
            except UserDetail.DoesNotExist:
                return JsonResponse({'message': 'Invalid Credentials'}, status=400)

        except Exception as e:
            return JsonResponse({'message': f'Error: {str(e)}'}, status=500)

    return JsonResponse({'message': 'Invalid request'}, status=400)


# ---------------- Add Expense ----------------
@csrf_exempt
def add_expense(request): 
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode("utf-8"))
            user_id = data.get('user') or data.get('userId')  # ✅ dono key support
            expense_date = data.get('expense_date') 
            expense_item = data.get('expense_item')
            expense_cost = data.get('expense_cost')

            if not user_id or not expense_date or not expense_item or not expense_cost:
                return JsonResponse({'message': 'All fields are required'}, status=400)

            try:
                user = UserDetail.objects.get(id=user_id)
            except UserDetail.DoesNotExist:
                return JsonResponse({'message': 'User not found'}, status=404)

            Expense.objects.create(
                user=user,
                expense_date=expense_date,
                expense_item=expense_item,
                expense_cost=expense_cost
            )
            return JsonResponse({'message': 'Expense added Successfully'}, status=201)

        except Exception as e:
            return JsonResponse({'message': 'Something went wrong', 'error': str(e)}, status=400)

    return JsonResponse({'message': 'Invalid request'}, status=400)


# ---------------- Manage Expense ----------------
@csrf_exempt
def manage_expense(request, user_id): 
    if request.method == 'GET':
        expenses = Expense.objects.filter(user=user_id).values()
        return JsonResponse(list(expenses), safe=False, status=200)

    return JsonResponse({'message': 'Invalid request'}, status=400)


# ---------------- Update Expense ----------------
@csrf_exempt
def update_expense(request, expense_id): 
    if request.method == 'PUT':
        try:
            data = json.loads(request.body.decode("utf-8"))
            try:
                expense = Expense.objects.get(id=expense_id)
            except Expense.DoesNotExist:
                return JsonResponse({'message': 'Expense not found'}, status=404)

            expense.expense_date = data.get('expense_date', expense.expense_date)
            expense.expense_item = data.get('expense_item', expense.expense_item)
            expense.expense_cost = data.get('expense_cost', expense.expense_cost)
            expense.save()

            return JsonResponse({'message': 'Expense updated successfully'}, status=200)

        except Exception as e:
            return JsonResponse({'message': 'Error updating expense', 'error': str(e)}, status=400)

    return JsonResponse({'message': 'Invalid request'}, status=400)

# ---------------- Delete Expense ----------------
@csrf_exempt
def delete_expense(request, expense_id):
    if request.method == 'DELETE':
        try:
            try:
                expense = Expense.objects.get(id=expense_id)
            except Expense.DoesNotExist:
                return JsonResponse({'message': 'Expense not found'}, status=404)

            expense.delete()
            return JsonResponse({'message': 'Expense deleted successfully'}, status=200)

        except Exception as e:
            return JsonResponse({'message': 'Error deleting expense', 'error': str(e)}, status=400)

    return JsonResponse({'message': 'Invalid request'}, status=400)

# ----------------Expense Report----------------

@csrf_exempt
def search_expense(request, user_id): 
    if request.method == 'GET':
        from_date = request.GET.get('from')
        to_date = request.GET.get('to')

        expenses = Expense.objects.filter(
            user=user_id,
            expense_date__range=[from_date, to_date]
        )

        expense_list = list(expenses.values())
        agg = expenses.aggregate(Sum('expense_cost'))   # {'expense_cost__sum': 2500}

        total = agg['expense_cost__sum'] or 0

        return JsonResponse({'expenses': expense_list, 'total': total})
    
    return JsonResponse({'message': 'Invalid request'}, status=400)

# ---------------- Change Password ----------------
@csrf_exempt
def change_password(request, user_id): 
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            old_password = data.get('oldPassword') 
            new_password = data.get('newPassword')

            if not old_password or not new_password:
                return JsonResponse({'message': 'Both old and new password are required'}, status=400)

            try:
                user = UserDetail.objects.get(id=user_id)
            except UserDetail.DoesNotExist:
                return JsonResponse({'message': 'User not found'}, status=404)

            if user.password != old_password:
                return JsonResponse({'message': 'Old password is incorrect'}, status=400)

            user.password = new_password 
            user.save()

            return JsonResponse({'message': 'Password changed successfully'}, status=200)

        except Exception as e:
            return JsonResponse({'message': f'Error: {str(e)}'}, status=500)

    return JsonResponse({'message': 'Invalid request'}, status=400)

