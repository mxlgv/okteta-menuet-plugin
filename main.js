function MagicToStr(magic) {
    var str = "";
    for(var i = 0; i < magic.length; i++) {
        str += magic[i].value;
    }
    return str;
}

function init() {
    const menuet01_magic = "MENUET01";
    const menuet01_header_size = 0x32

    var menuet01_header = struct({
        Magic           : array(char(), 8),
        HeaderVersion   : uint32(),
        EntryPoint      : uint32(),
        EndOfImage      : uint32(),
        MemorySize      : uint32(),
        StackTop        : uint32(),
        CmdLine         : uint32(),
        Path            : uint32()
    });

    menuet01_header.defaultLockOffset = 0;
    menuet01_header.byteOrder = "little-endian";
    menuet01_header.name = "MENUET01 header";

    menuet01_header.validationFunc = function() {
        if  (MagicToStr(this.Magic) != menuet01_magic) {
            this.validationError = "Bad Magic";
            return false;
        }

        if (this.EndOfImage.value < menuet01_header_size) {
            this.validationError = "EndOfImage < HeaderSize";
            return false;
        }

        if (this.EntryPoint.value < menuet01_header_size) {
            this.validationError = "EntryPoint < HeaderSize";
            return false;
        }

        if (this.EntryPoint.value > this.EndOfImage.value) {
            this.validationError = "EntryPoint > EndOfImage";
            return false;
        }

        if (this.StackTop.value < this.EndOfImage.value) {
            this.validationError = "StackTop < EndOfImage";
            return false;
        }

        if (this.MemorySize.value < this.StackTop.value) {
            this.validationError = "MemorySize < StackTop";
            return false;
        }

        return true;
    };

    return menuet01_header;
}
