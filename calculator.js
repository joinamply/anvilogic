$('.calculator_component').each(function () {
    // Wharehouse - Detect
    const detectWarehouseSize_XS = 8760;
    const detectWarehouseSize_S = 17520;
    const detectWarehouseSize_M = 35040;
    const detectWarehouseSize_L = 70080;
    const detectWarehouseSize_XL = 140160;
    const detectWarehouseSize_2XL = 280320;
    const detectWarehouseSize_3XL = 560640;
    const detectWarehouseSize_4XL = 1121280;

    // Wharehouse - Detect
    const adhocWarehouseSize_XS = 2190;
    const adhocWarehouseSize_S = 4380;
    const adhocWarehouseSize_M = 8760;
    const adhocWarehouseSize_L = 17520;
    const adhocWarehouseSize_XL = 35040;
    const adhocWarehouseSize_2XL = 70080;
    const adhocWarehouseSize_3XL = 140160;
    const adhocWarehouseSize_4XL = 280320;

    // Compute Loc
    const computeLoc_us_east = 3;
    const computeLoc_ap_southEast = 3.7;
    const computeLoc_eu_central = 3.6;

    // Data Load Service
    const dataService_snowpipe = 2190;
    const dataService_snowpipeADJ = 29200;

    // Storage Costs
    const storageCosts_tb = 288;
    const compressionRate = 0.8;
    const managedCost = 0.3;

    // Storage Loc
    const storageLoc_us_east = 24;
    const storageLoc_eu_central = 24.5;
    const storageLoc_ap_southEast = 26;

    // Comparables
    const gbYear_100 = 100;
    const gbYear_500 = 500;
    const gbYear_1024 = 1024;
    const gbYear_5120 = 5120;
    const gbYear_10240 = 10240;
    const gbYear_25600 = 25600;
    const gbYear_51200 = 51200;

    // Comparables Splunk
    const splunk_100 = 600;
    const splunk_500 = 500;
    const splunk_1024 = 390.63;
    const splunk_5120 = 366.21;
    const splunk_10240 = 292.97;
    const splunk_25600 = 244.14;
    const splunk_51200 = 195.31;

    // Comparables Splunk Cloud
    const splunkCloud_100 = 800;
    const splunkCloud_500 = 710;
    const splunkCloud_1024 = 683.59;
    const splunkCloud_5120 = 488.28;
    const splunkCloud_10240 = 390.63;
    const splunkCloud_25600 = 341.8;
    const splunkCloud_51200 = 195.31;

    // Comparables Azure Sentinel
    const azeureSentinel_100 = 715.4;
    const azeureSentinel_500 = 631.45;
    const azeureSentinel_1024 = 620.5;
    const azeureSentinel_5120 = 587.65;
    const azeureSentinel_10240 = 550.0;
    const azeureSentinel_25600 = 510.0;
    const azeureSentinel_51200 = 470.0;

    // Other Variables
    const credit_price = 3;
    const margin = 0;

    // Calc Variables
    let dataIngestion = 0;
    let dataRetention = 0;

    let storageSize = 0;

    let detectWarehouseSize = 0;
    let adhocWarehouseSize = 0;

    let credits_dataLoad = 0;
    let credits_detectWarehouseSize = 0;
    let credits_adhocWarehouseSize = 0;

    // Display Variables
    let totalLogging_computeCosts = 0;
    let totalLogging_storageCosts = 0;
    let totalLogging_estimatedCosts = 0;

    let comparables_estimatedCosts_splunk = 0;
    let comparables_estimatedCosts_splunkCloud = 0;
    let comparables_estimatedCosts_azureSentinel = 0;

    let comparable_savings_splunk = 0;
    let comparable_savings_splunkCould = 0;
    let comparable_savings_azureSentinel = 0;

    let totalAnvilogicCost = 0
    let totalCutomerEstimate = 0;

    // First run
    $('#data-ingestion').val(1000);
    dataIngestion = $('#data-ingestion').val();
    $('#data-retention').val(365);
    dataRetention = $('#data-retention').val();
    checkInput();

    $('#data-ingestion').change(function () {
        dataIngestion = $(this).val();
        checkInput();
    });

    $('#data-retention').change(function () {
        dataRetention = $(this).val();
        checkInput();
    });

    function checkInput() {
        if (dataIngestion === undefined || dataRetention === undefined) {
            return;
        }

        updateWarehouseSize();
        updateCredits();
        updateCosts();
        updateComparables();
        displayResults();
    }

    function updateWarehouseSize() {
        // Detect Warehouse Size
        if (dataIngestion <= 4000) {
            detectWarehouseSize = detectWarehouseSize_XS;
        } else if (dataIngestion <= 8000) {
            detectWarehouseSize = detectWarehouseSize_S;
        } else if (dataIngestion <= 16000) {
            detectWarehouseSize = detectWarehouseSize_M;
        } else if (dataIngestion <= 32000) {
            detectWarehouseSize = detectWarehouseSize_L;
        } else if (dataIngestion <= 60000) {
            detectWarehouseSize = detectWarehouseSize_XL;
        }
        else {
            detectWarehouseSize = detectWarehouseSize_2XL;
        }

        // Adhoc Warehouse Size
        adhocWarehouseSize = adhocWarehouseSize_S;
    }

    function updateCredits() {
        credits_dataLoad = (dataIngestion / 1024 * 25 * 365);
        credits_detectWarehouseSize = 365 * 1 * 12;
        credits_adhocWarehouseSize = 365 * 2 * 2;
        storageSize = ((dataIngestion * dataRetention) / 1024) * (1 - compressionRate);
    }

    function updateCosts() {
        // Total Logging Compute Costs
        totalLogging_computeCosts = credit_price * (credits_detectWarehouseSize + credits_dataLoad + credits_adhocWarehouseSize);
        // Total Logging Storage Costs
        if (storageSize * storageCosts_tb < 24) {
            totalLogging_storageCosts = 24;
        } else {
            totalLogging_storageCosts = (storageSize * storageCosts_tb) / 1;
        }
        // Total Logging Estimated Costs
        totalLogging_estimatedCosts = totalLogging_computeCosts + totalLogging_storageCosts;
        totalAnvilogicCost = totalLogging_computeCosts + totalLogging_storageCosts;
        totalCutomerEstimate = totalAnvilogicCost + 0;
    }

    function updateComparables() {
        if (dataIngestion < gbYear_500) {
            comparables_estimatedCosts_splunk = dataIngestion * splunk_100;
            comparables_estimatedCosts_splunkCloud = dataIngestion * splunkCloud_100;
            comparables_estimatedCosts_azureSentinel = dataIngestion * azeureSentinel_100;
        } else if (dataIngestion < gbYear_1024) {
            comparables_estimatedCosts_splunk = dataIngestion * splunk_500;
            comparables_estimatedCosts_splunkCloud = dataIngestion * splunkCloud_500;
            comparables_estimatedCosts_azureSentinel = dataIngestion * azeureSentinel_500;
        } else if (dataIngestion < gbYear_5120) {
            comparables_estimatedCosts_splunk = dataIngestion * splunk_1024;
            comparables_estimatedCosts_splunkCloud = dataIngestion * splunkCloud_1024;
            comparables_estimatedCosts_azureSentinel = dataIngestion * azeureSentinel_1024;
        } else if (dataIngestion < gbYear_10240) {
            comparables_estimatedCosts_splunk = dataIngestion * splunk_5120;
            comparables_estimatedCosts_splunkCloud = dataIngestion * splunkCloud_5120;
            comparables_estimatedCosts_azureSentinel = dataIngestion * azeureSentinel_5120;
        } else if (dataIngestion < gbYear_25600) {
            comparables_estimatedCosts_splunk = dataIngestion * splunk_10240;
            comparables_estimatedCosts_splunkCloud = dataIngestion * splunkCloud_10240;
            comparables_estimatedCosts_azureSentinel = dataIngestion * azeureSentinel_10240;
        } else if (dataIngestion < gbYear_51200) {
            comparables_estimatedCosts_splunk = dataIngestion * splunk_25600;
            comparables_estimatedCosts_splunkCloud = dataIngestion * splunkCloud_25600;
            comparables_estimatedCosts_azureSentinel = dataIngestion * azeureSentinel_25600;
        } else {
            comparables_estimatedCosts_splunk = dataIngestion * splunk_51200;
            comparables_estimatedCosts_splunkCloud = dataIngestion * splunkCloud_51200;
            comparables_estimatedCosts_azureSentinel = dataIngestion * azeureSentinel_51200;
        }

        // Calculate savings
        comparable_savings_splunk =
            (comparables_estimatedCosts_splunk - totalCutomerEstimate) / comparables_estimatedCosts_splunk;
        comparable_savings_splunkCould =
            (comparables_estimatedCosts_splunkCloud - totalCutomerEstimate) /
            comparables_estimatedCosts_splunkCloud;
        comparable_savings_azureSentinel =
            (comparables_estimatedCosts_azureSentinel - totalCutomerEstimate) /
            comparables_estimatedCosts_azureSentinel;
    }

    function displayResults() {
        $("[total-logging='compute-costs']").text(formatAsPrice(totalLogging_computeCosts));
        $("[total-logging='storage-costs']").text(formatAsPrice(totalLogging_storageCosts));
        $("[total-logging='estimated-costs']").text(formatAsPrice(totalLogging_estimatedCosts));

        $("[comparables='splunk']").text(formatAsPrice(comparables_estimatedCosts_splunk));
        $("[comparables='splunk-cloud']").text(formatAsPrice(comparables_estimatedCosts_splunkCloud));
        $("[comparables='azure-sentinel']").text(formatAsPrice(comparables_estimatedCosts_azureSentinel));

        $("[savings='splunk']").text(formatAsPercentage(comparable_savings_splunk));
        $("[savings='splunk-cloud']").text(formatAsPercentage(comparable_savings_splunkCould));
        $("[savings='azure-sentinel']").text(formatAsPercentage(comparable_savings_azureSentinel));
    }

    function formatAsPrice(num) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(num);
    }

    function formatAsPercentage(num) {
        return new Intl.NumberFormat('default', {
            style: 'percent',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(num);
    }
});