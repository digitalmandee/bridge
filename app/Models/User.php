<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, SoftDeletes;

    protected $dates = ['booking_quota_updated_at'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['name', 'email', 'type', 'role_id', 'password', 'profile_image', 'phone_no', 'secondary_phone_no', 'designation', 'address', 'cnic_number', 'cnic_image', 'total_booking_quota', 'booking_quota', 'printing_quota', 'total_printing_quota', 'company_id', 'allocated_seat_id', 'booking_quota_updated_at', 'status', 'deleted_at', 'last_login_at', 'blood_group'];

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
        'last_login_at' => 'datetime',
    ];

    protected $appends = ['last_login_human'];  // This ensures it appears in API responses

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function getLastLoginHumanAttribute()
    {
        return $this->last_login_at ? Carbon::parse($this->last_login_at)->diffForHumans() : 'Never logged in';
    }

    public function getTotalMembersAttribute()
    {
        return User::where('company_id', $this->id)->count();
    }

    // public function contract()
    // {
    //     return $this->belongsTo(Contract::class, 'created_by_branch_id');
    // }

    public function bookingSchedules()
    {
        return $this->hasMany(BookingSchedule::class);
    }

    public function bookingSchedulesByCompany()
    {
        return $this->hasMany(BookingSchedule::class, 'company_id');
    }

    public function company()
    {
        return $this->belongsTo(User::class, 'company_id', 'id');
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function booking()
    {
        return $this->hasOne(Booking::class);
    }

    public function chair()
    {
        return $this->belongsTo(BookingChair::class, 'allocated_seat_id', 'id');
    }

    public function companyUsers()
    {
        return $this->hasMany(User::class, 'company_id', 'id');
    }

    public function employee()
    {
        return $this->hasOne(Employee::class);
    }

    public function companyProfile()
    {
        return $this->hasOne(CompanyProfile::class);
    }

    public function userProfile()
    {
        return $this->hasOne(UserProfile::class);
    }

    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }

    public function userAddons()
    {
        return $this->hasMany(UserAddon::class);
    }

    /**
     * Get total + remaining for a specific addon type
     */
    public function getAddonQuota(string $type): array
    {
        $addon = $this
            ->userAddons()
            ->where('addon_type', $type)
            ->selectRaw('COALESCE(SUM(total),0) as total, COALESCE(SUM(remaining),0) as remaining')
            ->first();

        return [
            'total' => $addon?->total ?? 0,
            'remaining' => $addon?->remaining ?? 0,
        ];
    }

    /**
     * Shortcut: Meeting Room Hours quota
     */
    public function meetingRoomQuota(): array
    {
        return $this->getAddonQuota('booking_hours');
    }

    public function packages()
    {
        return $this->hasMany(UserPackage::class);
    }

    public function investor()
    {
        return $this->hasOne(Investor::class);
    }

    public function investments()
    {
        return $this->hasMany(Investment::class);
    }

    public function addons()
    {
        return $this->hasMany(UserAddon::class);
    }

    // In User.php

    public function meetingQuota()
    {
        return $this->calculateQuota('booking_hours');
    }

    public function printingQuota()
    {
        return $this->calculateQuota('printing_papers');
    }

    protected function calculateQuota(string $type)
    {
        $quotas = [
            'total' => 0,
            'remaining' => 0,
            'unlimited' => false,
        ];

        $today = now()->startOfDay();

        // 1️⃣ Active packages + their addons
        $activePackages = $this
            ->packages()
            ->where('status', 'active')
            ->where('valid_from', '<=', $today)
            ->where('valid_to', '>=', $today)
            ->with('addons')
            ->get();

        foreach ($activePackages as $package) {
            foreach ($package->addons->where('addon_type', $type) as $addon) {
                if ($addon->total == -1) {  // use -1 convention for unlimited
                    $quotas['unlimited'] = true;
                } else {
                    $quotas['total'] += $addon->total;
                    $quotas['remaining'] += $addon->remaining;
                }
            }
        }

        // 2️⃣ Standalone addons (user_package_id = null)
        $standaloneAddons = $this
            ->addons()
            ->whereNull('user_package_id')
            ->where('addon_type', $type)
            ->get();

        foreach ($standaloneAddons as $addon) {
            if ($addon->total == -1) {
                $quotas['unlimited'] = true;
            } else {
                $quotas['total'] += $addon->total;
                $quotas['remaining'] += $addon->remaining;
            }
        }

        return $quotas;
    }

    // public function employee()
    // {
    //     return $this->belongsTo(Employee::class, 'id', 'user_id');
    // }

    // Define notifications relationship (optional, but explicit)
    // public function notifications()
    // {
    //     return $this->morphMany('Illuminate\Notifications\DatabaseNotification', 'notifiable')->orderBy('created_at', 'desc');
    // }
}
