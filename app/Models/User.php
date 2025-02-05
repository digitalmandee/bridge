<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, SoftDeletes;
    protected $dates = ['booking_quota_updated_at'];
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'type',
        'role_id',
        'password',
        'profile_image',
        'phone_no',
        'designation',
        'address',
        'total_booking_quota',
        'booking_quota',
        'printing_quota',
        'company_id',
        'allocated_seat_id',
        'booking_quota_updated_at',
        'created_by_branch_id',
        'status',
        'deleted_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function role()
    {
        return $this->belongsTo(Role::class);
    }
    public function userBranch()
    {
        return $this->belongsTo(Branch::class, 'created_by_branch_id');
    }
    public function branch()
    {
        return $this->hasOne(Branch::class);
    }

    public function BookingInvoices()
    {
        return $this->hasMany(BookingInvoice::class);
    }

    public function bookingSchedules()
    {
        return $this->hasMany(BookingSchedule::class);
    }

    public function bookingSchedulesByCompany()
    {
        return $this->hasMany(BookingSchedule::class, 'company_id');
    }

    public function booking()
    {
        return $this->hasOne(Booking::class);
    }

    public function chair()
    {
        return $this->belongsTo(Chair::class, 'allocated_seat_id', 'id');
    }


    // Define notifications relationship (optional, but explicit)
    // public function notifications()
    // {
    //     return $this->morphMany('Illuminate\Notifications\DatabaseNotification', 'notifiable')->orderBy('created_at', 'desc');
    // }
}