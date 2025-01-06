@extends('admin.master')
@section('title', __('Payment'))
@section('content')
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div>
            <h3 class="mb-3 mb-md-0">Payment Deatils</h3>
        </div>
    </div>
    <div class="col-md-12 d-flex justify-content-center">
        <div class="payment-container">
            <div class="payment-options">
                <div class="options d-flex gap-2">
                    <div class="d-flex flex-column">
                        <button class="option-img" id="cash" onclick="activateOption('cash')">
                            <img src="{{ asset('icons/cash.svg') }}" alt="Cash Payment" width="50px">
                        </button>
                        Cash Payment
                    </div>
                    <div class="d-flex flex-column">
                        <button class="option-img" id="bank" onclick="activateOption('bank')">
                            <img src="{{ asset('icons/cash.svg') }}" alt="Bank Payment" width="50px">
                        </button>
                        bank Payment
                    </div>
                </div>
            </div>
            <div class="upload-deatils">
                <label for="fileUpload" class="upload-label">
                    <i class="upload-icon">
                        <img src="{{ asset('icons/uplod-file.svg') }}" alt="Upload File Icon" width="20px">
                    </i>
                </label>
                <input type="file" id="fileUpload" onchange="showFileInfo(event)">
                <div id="fileInfo" class="file-info"></div>
            </div>
            <div class="actions">
                <button class="btn-secondary cancel" id="cancelButton" onclick="cancelFile()">Cancel</button>
                <button class="layout-btn active">CONFIRM</button>
            </div>
        </div>
    </div>
</div>
<style>
    .options button.active {
        background-color: #FFCC16;
        color: #fff;
    }

    .actions .cancel {
        color: white;
        display: none;
        /* Initially hidden */
    }
</style>
<script>
    function activateOption(optionId) {
        document.getElementById('cash').classList.remove('active');
        document.getElementById('bank').classList.remove('active');
        document.getElementById(optionId).classList.add('active');
    }

    function showFileInfo(event) {
        const file = event.target.files[0];
        if (file) {
            document.getElementById('fileInfo').textContent = `File: ${file.name}`;
            document.getElementById('cancelButton').style.display = 'inline-block'; // Show cancel button
        }
    }

    function cancelFile() {
        const fileInput = document.getElementById('fileUpload');
        fileInput.value = ''; // Reset the file input
        document.getElementById('fileInfo').textContent = ''; // Clear file info
        document.getElementById('cancelButton').style.display = 'none'; // Hide cancel button
    }
</script>
@endsection