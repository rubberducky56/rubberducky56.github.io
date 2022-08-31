let headers;
let sidebarLinks;

$(document).ready(function () {
    headers = $(".post-content h3").toArray();

    const sidebar = $("#post__sidebar-left");

    for (let i = 0; i < headers.length; i++) {
        const currentHeader = headers[i];
        const headerText = $(currentHeader).text();
        const headerId = $(currentHeader).attr("id");
        const headerType = $(currentHeader).prop("nodeName").toLowerCase();

        const newLine = "<" + "h6" + "> <a id=side href=\"#" + headerId + "\">" + headerText + "</a> </" + headerType + ">";
        sidebar.append(newLine);
    }

    sidebarLinks = $("#post__sidebar-left a").toArray();

    $(window).scroll(function () {
        let bottomScroll = $(window).scrollTop() + ($(window).height() / 2);
        let found = false;

        for (let i = headers.length - 1; i >= 0; i--) {
            const currentHeader = headers[i];
            const currentSidebarLink = sidebarLinks[i];
            $(currentSidebarLink).removeClass("current");

            const headerVPPosition = $(currentHeader).offset().top;
            console.log(headerVPPosition);

            if (!found && bottomScroll > headerVPPosition) {
                $(currentSidebarLink).addClass("current");
                found = true;
            }
        }
    });
});
