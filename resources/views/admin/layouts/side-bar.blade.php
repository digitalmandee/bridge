<nav class="sidebar">
    <div class="sidebar-header">
        <a href="#" class="sidebar-brand">
            <img class="link-icon" src="{{ asset('icons/logo.svg') }}" alt="dashboard Icon" width="100px">
        </a>
    </div>
    <div class="sidebar-body">
        <ul class="nav">
            @can('dashboard')
                <li class="nav-item bar-item mb-1">
                    <a href="{{ route('dashboard') }}" class="nav-link bar-link">
                        <img class="link-icon" src="{{ asset('icons/dashboard.svg') }}" alt="dashboard Icon">
                        <span class="link-title">Dashboard</span>
                    </a>
                </li>
            @endcan()
            @can('branches')
                <li class="nav-item bar-item mb-1">
                    <a href="{{ route('admin.branches') }}" class="nav-link bar-link">
                        <img class="link-icon" src="{{ asset('icons/branches.svg') }}" alt="Branches Icon">
                        <span class="link-title">Branches</span>
                    </a>
                </li>
            @endcan
            @can('branch-manager')
                <li class="nav-item bar-item mb-1">
                    <a href="{{ route('admin.branch.manager') }}" class="nav-link bar-link">
                        <img class="link-icon" src="{{ asset('icons/branch-manager.svg') }}" alt="Branch-Manager Icon">
                        <span class="link-title">Branch Manager</span>
                    </a>
                </li>
            @endcan
            @can('products')
                <li class="nav-item bar-item mb-1">
                    <a href="#" class="nav-link bar-link">
                        <img class="link-icon" src="{{ asset('icons/product.svg') }}" alt="Products Icon">
                        <span class="link-title">Products</span>
                    </a>
                </li>
            @endcan
            @can('floor-plan')
                <li class="nav-item bar-item mb-1">
                    <a href="{{ route('admin.floor.plan') }}" class="nav-link bar-link">
                        <img class="link-icon" src="{{ asset('icons/floorplan.svg') }}" alt="Floor Icon">
                        <span class="link-title">Floor Plan</span>
                    </a>
                </li>
            @endcan
            @can('inventory-management')
                <li class="nav-item bar-item mb-1">
                    <a href="{{ route('admin.inventory.management') }}" class="nav-link bar-link">
                        <img class="link-icon" src="{{ asset('icons/inventory.svg') }}" alt="Inventory Icon">
                        <span class="link-title">Inventory Management</span>
                    </a>
                </li>
            @endcan
            @can('booking-management')
                <li class="nav-item bar-item mb-1">
                    <a href="{{ route('admin.booking.calendar') }}" class="nav-link bar-link">
                        <img class="link-icon" src="{{ asset('icons/booking.svg') }}" alt="Booking Icon">
                        <span class="link-title">Booking Management</span>
                    </a>
                </li>
            @endcan
            @can('expense-management')
                <li class="nav-item bar-item mb-1">
                    <a href="#" class="nav-link bar-link">
                        <img class="link-icon" src="{{ asset('icons/expenseside.svg') }}" alt="Expense Icon">
                        <span class="link-title">Expense Management</span>
                    </a>
                </li>
            @endcan
            @can('financial-report')
                <li class="nav-item bar-item mb-1">
                    <a href="#" class="nav-link bar-link">
                        <img class="link-icon" src="{{ asset('icons/finalcial.svg') }}" alt="Financial Icon">
                        <span class="link-title">Financial Report</span>
                    </a>
                </li>
            @endcan
            @can('revenue-check')
                <li class="nav-item bar-item mb-1">
                    <a href="#" class="nav-link bar-link">
                        <img class="link-icon" src="{{ asset('icons/revenue.svg') }}" alt="Revenue Icon">
                        <span class="link-title">Revenue Check</span>
                    </a>
                </li>
            @endcan
            @can('calendar')
                <li class="nav-item bar-item mb-1">
                    <a href="#" class="nav-link bar-link">
                        <img class="link-icon" src="{{ asset('icons/booking.svg') }}" alt="Calender Icon">
                        <span class="link-title">Calender</span>
                    </a>
                </li>
            @endcan
            @can('contact')
                <li class="nav-item bar-item mb-1">
                    <a href="#" class="nav-link bar-link">
                        <img class="link-icon" src="{{ asset('icons/contact.svg') }}" alt="Contact Icon">
                        <span class="link-title">Contact</span>
                    </a>
                </li>
            @endcan
            @can('settings')
                <li class="nav-item bar-item mb-1">
                    <a href="#" class="nav-link bar-link">
                        <img class="link-icon" src="{{ asset('icons/setting.svg') }}" alt="Settings Icon">
                        <span class="link-title">Settings</span>
                    </a>
                </li>
            @endcan
            @can('roles')
                <li class="nav-item bar-item mb-1">
                    <a href="{{ route('admin.roles') }}" class="nav-link bar-link">
                        <img class="link-icon" src="{{ asset('icons/setting.svg') }}" alt="Settings Icon">
                        <span class="link-title">Roles</span>
                    </a>
                </li>
            @endcan
            @can('permissions')
                <li class="nav-item bar-item mb-1">
                    <a href="{{ route('admin.permissions') }}" class="nav-link bar-link">
                        <img class="link-icon" src="{{ asset('icons/setting.svg') }}" alt="Settings Icon">
                        <span class="link-title">Permissions</span>
                    </a>
                </li>
            @endcan
            <li class="nav-item bar-item mb-1">
                <form action="{{ route('logout') }}" method="post" class="nav-link bar-link">
                    @csrf
                    <a href="#">
                        <img class="link-icon" src="{{ asset('icons/logout.svg') }}" style="margin-top:2px;"
                            alt="Logout Icon">
                        <button type="submit" class="link-title side-logout">Logout</button>
                    </a>
                </form>
            </li>
        </ul>
    </div>
</nav>
