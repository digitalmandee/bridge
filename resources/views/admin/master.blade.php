<!DOCTYPE html>
<html lang="en">
    <!-- head -->
     @include('admin.layouts.head')
    <!-- /head -->
  <body>
    <div class="main-wrapper">
      <!-- SideBar -->
       @include('admin.layouts.side-bar')
     <!-- /Sidebar -->

      <div class="page-wrapper">
        <!-- navbar -->
         @include('admin.layouts.nav-bar')
        <!-- /navbar -->

        <!-- Content -->
         @yield('content')
        <!-- /Content -->

        <!-- Footer -->
         @include('admin.layouts.footer')
        <!-- /Footer -->
      </div>
    </div>
    <!-- Script -->
     @include('admin.layouts.scripts')
    <!-- /Script -->
  </body>
</html>
