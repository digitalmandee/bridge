<nav class="sidebar">
    <div class="sidebar-header">
        <a href="#" class="sidebar-brand">
            Bridge
        </a>
        <div class="sidebar-toggler not-active">
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
    <div class="sidebar-body">
        <ul class="nav">
            <li class="nav-item bar-item">
                <a href="{{route('dashboard')}}" class="nav-link bar-link active">
                    <img  class="link-icon" src="{{ asset('icons/dashboard.svg') }}" alt="dashboard Icon">
                    <span class="link-title">Dashboard</span>
                </a>
            </li>
            <li class="nav-item bar-item">
                <a href="{{ route('admin.branches') }}" class="nav-link bar-link">
                    <img  class="link-icon" src="{{ asset('icons/dashboard.svg') }}" alt="dashboard Icon">
                    <span class="link-title">Branches</span>
                </a>
            </li>
            <li class="nav-item bar-item">
                <a href="{{ route('admin.branch.manager') }}" class="nav-link bar-link">
                    <img  class="link-icon" src="{{ asset('icons/dashboard.svg') }}" alt="dashboard Icon">
                    <span class="link-title">Branch Manager</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="#" class="nav-link bar-link">
                <img  class="link-icon" src="{{ asset('icons/product.svg') }}" alt="Products Icon">
                    <span class="link-title">Products</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="#" class="nav-link bar-link">
                <img  class="link-icon" src="{{ asset('icons/floorplan.svg') }}" alt="Floor Icon">
                    <span class="link-title">Floor Plan</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="#" class="nav-link bar-link">
                <img  class="link-icon" src="{{ asset('icons/inventory.svg') }}" alt="Inventory Icon">
                    <span class="link-title">Inventory Management</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="#" class="nav-link bar-link">
                <img  class="link-icon" src="{{ asset('icons/booking.svg') }}" alt="Booking Icon">
                    <span class="link-title">Booking Management</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="#" class="nav-link bar-link">
                <img  class="link-icon" src="{{ asset('icons/expenseside.svg') }}" alt="Expense Icon">
                    <span class="link-title">Expense Management</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="#" class="nav-link bar-link">
                <img  class="link-icon" src="{{ asset('icons/finalcial.svg') }}" alt="Financial Icon">
                    <span class="link-title">Financial Report</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="#" class="nav-link bar-link">
                <img  class="link-icon" src="{{ asset('icons/revenue.svg') }}" alt="Revenue Icon">
                    <span class="link-title">Revenue Check</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="#" class="nav-link bar-link">
                <img  class="link-icon" src="{{ asset('icons/booking.svg') }}" alt="Calender Icon">
                    <span class="link-title">Calender</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="#" class="nav-link bar-link">
                <img  class="link-icon" src="{{ asset('icons/contact.svg') }}" alt="Contact Icon">
                    <span class="link-title">Contact</span>
                </a>
            </li>
            <li class="nav-item">
                <a href="#" class="nav-link bar-link">
                <img  class="link-icon" src="{{ asset('icons/setting.svg') }}" alt="Settings Icon">
                    <span class="link-title">Settings</span>
                </a>
            </li>
            <li class="nav-item">
                <form action="{{route('logout')}}" method="post" class="nav-link bar-link">
                    @csrf
                    <a href="#">
                <img  class="link-icon" src="{{ asset('icons/logout.svg') }}"style="margin-top:2px;" alt="Logout Icon">
                        <button type="submit" class="link-title side-logout">Logout</button>
                    </a>
                </form>
            </li>
        </ul>
    </div>
</nav>