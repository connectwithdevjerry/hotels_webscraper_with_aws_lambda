#include <stdio.h>
#include <sys/capability.h>

int main(void) {
    cap_t caps = cap_get_proc();
    cap_value_t capList[2] = {CAP_SETUID, CAP_SETGID};
    cap_set_flag(caps, CAP_EFFECTIVE, 2, capList, CAP_SET);
    cap_set_flag(caps, CAP_PERMITTED, 2, capList, CAP_SET);
    cap_set_proc(caps);
    return 0;
}
